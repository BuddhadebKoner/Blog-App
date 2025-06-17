import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from "./src/config/db.js";
import authRouter from './src/routes/user.route.js';
import blogRoute from './src/routes/blog.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Origin ${origin} not allowed by CORS`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: "Blog API Server - I'm alive!",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/blog', blogRoute);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error occurred:', error);
  
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    });
  }

  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// Start server (only for local development)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
    console.log(`Allowed origins for CORS: ${allowedOrigins.join(', ')}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please close the application using this port and try again.`);
    } else {
      console.error('An error occurred when starting the server:', err);
    }
    process.exit(1);
  });
}

// Export for Vercel
export default app;