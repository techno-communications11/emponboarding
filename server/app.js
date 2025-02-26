import express from 'express';
import dotenv from 'dotenv';
import db from './dbConnection/db.js'; // Database connection
import router from './router/auth.route.js'; // Router
import cors from 'cors';

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3001', // Allow only requests from this domain
  methods: ['GET', 'POST','PUT'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
};
app.use(cors(corsOptions));

// Serve static files from the 'public' folder (if needed)

// Use routes
app.use('/auth', router);
 console.log(db)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000; // Use environment variable if available
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));