import mysql from 'mysql2/promise';
import { config } from './config.js';

let pool;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}


