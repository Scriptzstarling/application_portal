import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5005', 10),
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'application_portal',
  jwtSecret: process.env.JWT_SECRET || 'please_change_me',
  otpExpiryMinutes: parseInt(process.env.OTP_EXP_MINUTES || '5', 10)
};


