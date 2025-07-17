const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const formRoutes = require('./routes/formRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const net = require('net');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:3007', 'http://localhost:3008'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/form', formRoutes);

// 404 handler for undefined routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Function to try different ports
    const tryPort = (port) => {
      return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
          console.log(`🚀 Server running on port ${port}`);
          console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
          console.log(`🌐 CORS Origins: ${process.env.CORS_ORIGIN || 'http://localhost:3000-3004'}`);
          console.log(`📝 API Documentation:`);
          console.log(`   POST /api/form - Submit mesothelioma claim form`);
          console.log(`   GET  /api/form - Get all form submissions (with pagination)`);
          console.log(`   GET  /api/form/stats - Get submission statistics`);
          console.log(`   GET  /health - Health check endpoint`);
          resolve(server);
        });

        server.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            reject(err);
          } else {
            console.error('❌ Server error:', err);
            process.exit(1);
          }
        });
      });
    };

    // Try ports starting from the specified port
    let currentPort = PORT;
    let server;
    
    while (currentPort < PORT + 10) {
      try {
        server = await tryPort(currentPort);
        break;
      } catch (err) {
        console.log(`⚠️  Port ${currentPort} is in use, trying ${currentPort + 1}...`);
        currentPort++;
      }
    }

    if (!server) {
      console.error(`❌ Could not find an available port between ${PORT} and ${PORT + 9}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();

module.exports = app; 