import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function getBillingFromDB(customerId) {
  try {
    
    const [rows] = await pool.query(
      'SELECT status, balance FROM billing WHERE customer_id = ?', 
      [customerId]
    );
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("MySQL Database Error:", error);
    throw error;
  }
}