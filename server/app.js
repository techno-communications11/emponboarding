import 'dotenv/config'; // Add this to load .env
import express from 'express';
import cors from 'cors';
import router from './router/auth.route.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Debug to verify CLIENT_URL
console.log('CORS Origin:', process.env.CLIENT_URL);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL, // No need for template string unless manipulating
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/auth', router);

// Start server
const PORT = process.env.PORT || 4503;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});