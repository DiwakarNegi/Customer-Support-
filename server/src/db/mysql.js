import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
    host : process.env.DB_HOST || 'localhost',
    user : process.env.DB_USER || 'root',
    password : process.env.DB_PASSWORD || 'password',
    database : process.env.DB_NAME || 'support_db',
});

//for the billing tool
export async function fetchBillingInfo(userId) {
 const [rows] = await pool.query('SELECT * FROM billing WHERE customer_id = ?', 
    [customerId]
  );
  return rows[0];
}