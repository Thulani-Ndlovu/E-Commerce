// Import the 'mysql2/promise' library for MySQL operations
import mysql from 'mysql2/promise';

// Load environment variables from a .env file
import 'dotenv/config';

// Create a MySQL connection pool using the provided configuration
const pool = mysql.createPool({
  host: process.env.ProductDB_HOST,       // Database host
  user: process.env.ProductDB_USER,       // Database user
  database: process.env.ProductDB_NAME,   // Database name
  password: process.env.ProductDB_PASSWORD, // Database password
  waitForConnections: true,               // Whether the pool should wait for connections
  connectionLimit: 10,                    // Maximum number of connections in the pool
  queueLimit: 0                           // Maximum number of connection requests the pool will queue
});

// Function to establish a connection to the database and return the connection
async function connectToDatabase() {
  try {
    // Attempt to get a connection from the pool
    const connection = await pool.getConnection();

    // Log a message if the connection is successful
    console.log('Connected to the database');

    // Return the obtained connection
    return connection;
  } catch (error) {
    // Log an error message if connection fails
    console.error('Error connecting to the database:', error);

    // Exit the process if connection fails
    process.exit(1);
  }
}

// Export the MySQL connection pool and the connectToDatabase function for external use
export { pool, connectToDatabase };
