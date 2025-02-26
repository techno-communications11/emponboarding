import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create a MySQL connection pool with promise-based API
const db = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
  } else {
    console.log('Database connected!');
    connection.release(); // Release the connection
  }
});

// Export the promise-based pool
export default db.promise();