import twilio from 'twilio';
import { config } from './config.js';

const smsProvider = process.env.SMS_PROVIDER || 'twilio';

function normalizeToE164(mobile) {
  const defaultCode = process.env.DEFAULT_COUNTRY_CODE || '+91';
  const digits = String(mobile).trim();
  if (digits.startsWith('+')) return digits;
  return defaultCode + digits.replace(/^0+/, '');
}

export async function sendOtpSms(mobile, otp) {
  const to = normalizeToE164(mobile);
  const message = `Your OTP is ${otp}. It is valid for ${config.otpExpiryMinutes} minutes.`;

  if (smsProvider === 'twilio') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER; // e.g. +1xxxxxxxxxx
    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER');
    }
    const client = twilio(accountSid, authToken);
    await client.messages.create({ body: message, from: fromNumber, to });
    return { delivered: true };
  }

  if (smsProvider === 'debug') {
    // Development mode: do not send SMS, expose OTP in logs and allow caller to return it for testing
    console.log(`DEBUG SMS to ${to}: ${message}`);
    return { delivered: false, debugOtp: otp };
  }

  throw new Error(`Unsupported SMS_PROVIDER: ${smsProvider}`);
}


