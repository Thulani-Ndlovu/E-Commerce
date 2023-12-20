import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.ProductDB_HOST,
  user: process.env.ProductDB_USER,
  database: process.env.ProductDB_NAME,
  password: process.env.ProductDB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function connectToDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process if connection fails
  }
}

export { pool, connectToDatabase };
