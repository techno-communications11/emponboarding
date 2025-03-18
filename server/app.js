import express from 'express';
import cors from 'cors';
import router from './router/auth.route.js'; // Your router file
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3403', // Your frontend origin
  credentials: true, // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Routes
app.use('/auth', router); // Assuming your login route is under /auth

// Start server
const PORT = process.env.PORT || 4503;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});