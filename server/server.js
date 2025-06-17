import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routes/user.route.js"
import blogRoute from "./src/routes/blog.route.js";

dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
}

const app = express();
const port = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy in production (for Vercel, Heroku, etc.)
app.set('trust proxy', 1);

// Security Headers - Modified for Vercel
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for Vercel compatibility
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting - More lenient for serverless
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 200, // Increased for serverless
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/';
  }
});

app.use('/api/', limiter);

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// MongoDB injection prevention
app.use(mongoSanitize());

// Database connection with better error handling
let isConnected = false;

const initializeDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  
  try {
    await connectDB();
    isConnected = true;
    if (!isProduction) {
      console.log('Database connected successfully');
    }
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    isConnected = false;
    // In serverless, throw error to prevent function execution without DB
    if (process.env.VERCEL) {
      throw new Error('Database connection failed');
    }
    // In development, don't throw to prevent server crashes
    if (!isProduction) {
      throw error;
    }
    return false;
  }
};

// CORS configuration with better origin handling
const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://192.168.31.100:5173'
];

// Add development origins
if (isDevelopment) {
  allowedOrigins.push('http://localhost:5174', 'http://127.0.0.1:5174');
}

// Add production domains
if (process.env.PRODUCTION_DOMAINS) {
  const productionDomains = process.env.PRODUCTION_DOMAINS.split(',').map(domain => domain.trim());
  allowedOrigins.push(...productionDomains);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin in development (e.g., mobile apps, Postman)
    if (!origin && isDevelopment) {
      return callback(null, true);
    }
    
    // For Vercel serverless functions, allow no origin
    if (!origin && process.env.VERCEL) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      if (!isProduction) {
        console.log(`🚫 Origin ${origin} not allowed by CORS`);
        console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
      }
      // In production, be strict with CORS unless it's a serverless function call
      if (isProduction && process.env.VERCEL && !origin) {
        return callback(null, true);
      } else if (isProduction) {
        return callback(new Error('Not allowed by CORS'));
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-File-Name"
  ],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Initialize DB connection for each request in serverless
app.use(async (req, res, next) => {
  try {
    const connected = await initializeDB();
    if (!connected && process.env.VERCEL) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    if (process.env.VERCEL) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    }
    next();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    vercel: !!process.env.VERCEL
  };

  res.status(200).json(healthcheck);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Blog API Server",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    vercel: !!process.env.VERCEL
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/blog', blogRoute);

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  if (!isProduction) {
    console.error('💥 Error occurred:', error);
  }

  // CORS errors
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation - origin not allowed'
    });
  }

  // MongoDB errors
  if (error.name === 'MongoError' || error.name === 'MongooseError') {
    return res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // Default error
  res.status(error.status || 500).json({
    success: false,
    message: isDevelopment ? error.message : 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
});

// For local development
if (!process.env.VERCEL) {
  const startServer = async () => {
    try {
      await initializeDB();
      app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}/`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
        console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
        console.log(`📊 Database: Connected`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();
}

// Export for Vercel
export default app;