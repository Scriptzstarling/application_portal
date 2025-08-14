import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { getDbPool } from '../db.js';
import { config } from '../config.js';
import { requireAuth } from '../middleware/auth.js';
import { sendOtpSms } from '../sms.js';

export const authRouter = Router();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOtpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req.body && req.body.mobile) ? `m:${req.body.mobile}` : `ip:${req.ip}`,
  handler: (req, res) => res.status(429).json({ error: 'Too many OTP requests, please try again later' })
});

authRouter.post('/send-otp', sendOtpLimiter, async (req, res, next) => {
  try {
    const { mobile, username } = req.body;
    if (!mobile) return res.status(400).json({ error: 'Mobile is required' });
    if (!username || !String(username).trim()) return res.status(400).json({ error: 'Username is required' });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);
    const pool = getDbPool();
    const [result] = await pool.execute(
      'INSERT INTO otp_verifications (mobile, otp, verified, expires_at) VALUES (?, ?, 0, ?)',
      [mobile, otp, expiresAt]
    );

    try {
      const result = await sendOtpSms(mobile, otp);
      if (process.env.SMS_PROVIDER === 'debug' && result && result.debugOtp) {
        return res.json({ message: 'OTP generated (debug mode)', otp: result.debugOtp });
      }
    } catch (smsErr) {
      try { await pool.execute('DELETE FROM otp_verifications WHERE id = ?', [result.insertId]); } catch {}
      throw smsErr;
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/verify-otp', async (req, res, next) => {
  try {
    const { mobile, otp, username } = req.body;
    if (!mobile || !otp) return res.status(400).json({ error: 'Mobile and OTP are required' });

    const pool = getDbPool();
    const [rows] = await pool.execute(
      'SELECT * FROM otp_verifications WHERE mobile = ? AND otp = ? AND verified = 0 ORDER BY id DESC LIMIT 1',
      [mobile, otp]
    );

    if (!rows.length) return res.status(400).json({ error: 'Invalid OTP' });
    const record = rows[0];
    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    const [[existing]] = await pool.execute('SELECT id FROM users WHERE mobile = ? LIMIT 1', [mobile]);
    await pool.execute('UPDATE otp_verifications SET verified = 1 WHERE id = ?', [record.id]);
    if (!existing) {
      if (!username || !String(username).trim()) {
        return res.status(400).json({ error: 'Username is required' });
      }
      await pool.execute('INSERT IGNORE INTO users (mobile, username) VALUES (?, ?)', [mobile, String(username).trim()]);
    }
    const [[user]] = await pool.execute('SELECT id, mobile, username FROM users WHERE mobile = ? LIMIT 1', [mobile]);
    const token = jwt.sign({ sub: user.id, mobile: user.mobile, username: user.username || '' }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      // Prefer fresh DB data if available
      try {
        const pool = getDbPool();
        const [[user]] = await pool.execute(
          'SELECT id, mobile, username FROM users WHERE id = ? LIMIT 1',
          [payload.sub]
        );
        if (user) return res.json({ id: user.id, mobile: user.mobile, username: user.username || '' });
      } catch {}
      // Fallback to token payload
      return res.json({ id: payload.sub, mobile: payload.mobile, username: payload.username || '' });
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    next(err);
  }
});

// Optional: a login alias that re-sends OTP to existing users only
authRouter.post('/login/send-otp', sendOtpLimiter, async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: 'Mobile is required' });
    const pool = getDbPool();
    const [[user]] = await pool.execute('SELECT id, username FROM users WHERE mobile = ? LIMIT 1', [mobile]);
    if (!user) return res.status(404).json({ error: 'User not found, please register' });
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);
    const [result] = await pool.execute(
      'INSERT INTO otp_verifications (mobile, otp, verified, expires_at) VALUES (?, ?, 0, ?)',
      [mobile, otp, expiresAt]
    );
    try {
      const r = await sendOtpSms(mobile, otp);
      if (process.env.SMS_PROVIDER === 'debug' && r && r.debugOtp) {
        return res.json({ message: 'OTP generated (debug mode)', username: user.username, otp: r.debugOtp });
      }
    } catch (e) { try { await pool.execute('DELETE FROM otp_verifications WHERE id = ?', [result.insertId]); } catch {}; throw e; }
    res.json({ message: 'OTP sent successfully', username: user.username });
  } catch (err) {
    next(err);
  }
});


