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

const app = express();
const port = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy in production (for Vercel, Heroku, etc.)
if (isProduction) {
  app.set('trust proxy', 1);
}

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 100, // limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
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

// Database connection
const initializeDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      if (!isProduction) {
        process.exit(1);
      }
    }
  }
};

// Connect to DB based on environment
if (!isProduction || !process.env.VERCEL) {
  initializeDB();
} else {
  // For serverless environments, connect on each request if needed
  app.use(async (req, res, next) => {
    try {
      await initializeDB();
      next();
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    }
  });
}

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://192.168.31.100:5173',
  ...(isDevelopment ? ['http://localhost:5174', 'http://127.0.0.1:5174'] : [])
].filter(Boolean);

// Add production domains if they exist
if (isProduction && process.env.PRODUCTION_DOMAINS) {
  const productionDomains = process.env.PRODUCTION_DOMAINS.split(',');
  allowedOrigins.push(...productionDomains);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin && isDevelopment) {
      return callback(null, true);
    }

    if (!origin && isProduction) {
      return callback(new Error('Origin not allowed by CORS in production'));
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`🚫 Origin ${origin} not allowed by CORS`);
      console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
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
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };

  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).json(healthcheck);
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Blog API Server",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
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
  console.error('💥 Error occurred:', error);

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

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🔄 Received kill signal, shutting down gracefully...');

  // Close database connection
  mongoose.connection.close(() => {
    console.log('📦 Database connection closed.');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Only start the server if not in serverless environment
if (!isProduction || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}/`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`📊 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  });
}

export default app;