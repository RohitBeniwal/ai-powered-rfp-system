require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { checkOllamaStatus } = require('./services/ollama');

// Import routes
const rfpsRouter = require('./routes/rfps');
const vendorsRouter = require('./routes/vendors');
const proposalsRouter = require('./routes/proposals');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const ollamaStatus = await checkOllamaStatus();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      ollama: ollamaStatus
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API Routes
app.use('/api/rfps', rfpsRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/proposals', proposalsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI-Powered RFP Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      rfps: '/api/rfps',
      vendors: '/api/vendors',
      proposals: '/api/proposals'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 AI-Powered RFP Management System');
  console.log('='.repeat(50));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n📋 Available Endpoints:');
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   RFPs:         http://localhost:${PORT}/api/rfps`);
  console.log(`   Vendors:      http://localhost:${PORT}/api/vendors`);
  console.log(`   Proposals:    http://localhost:${PORT}/api/proposals`);
  console.log('\n⚠️  Important:');
  console.log('   Make sure Ollama is running: ollama serve');
  console.log('   Make sure llama3.1 model is pulled: ollama pull llama3.1');
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
