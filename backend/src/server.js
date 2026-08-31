const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const Admin = require('./models/Admin');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ==================== MIDDLEWARE ====================

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:4000',
    'https://nepali-sena-complete-website.onrender.com/',
    'https://nepali-sena-complete-backend.onrender.com/',
    'http://127.0.0.1:4000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==================== STATIC FILES ====================

// Serve static files from public directory
const publicPath = path.join(__dirname, '../public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  console.log('✅ Public directory found and mounted');
} else {
  console.log('⚠️  Public directory not found, creating...');
  fs.mkdirSync(publicPath, { recursive: true });
  // Create a basic index.html if it doesn't exist
  const indexPath = path.join(publicPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nepali Sena API</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      max-width: 600px;
    }
    h1 {
      font-size: 3em;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 1.2em;
      opacity: 0.9;
      margin-bottom: 30px;
    }
    .status {
      display: inline-block;
      background: #4CAF50;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .endpoints {
      text-align: left;
      background: rgba(0,0,0,0.2);
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    }
    .endpoints h3 {
      margin-top: 0;
    }
    .endpoint {
      padding: 5px 0;
      font-family: monospace;
    }
    .endpoint a {
      color: #FFD700;
      text-decoration: none;
    }
    .endpoint a:hover {
      text-decoration: underline;
    }
    .footer {
      margin-top: 30px;
      opacity: 0.7;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🇳🇵 Nepali Sena</h1>
    <div class="subtitle">API Server</div>
    <div class="status">● Server Running</div>
    
    <div class="endpoints">
      <h3>📡 Available Endpoints</h3>
      <div class="endpoint">🔗 <a href="/api/health">/api/health</a> - Health Check</div>
      <div class="endpoint">🔐 <a href="/api/auth">/api/auth</a> - Authentication</div>
      <div class="endpoint">👑 <a href="/api/superadmin">/api/superadmin</a> - Super Admin</div>
      <div class="endpoint">📰 <a href="/api/news">/api/news</a> - News</div>
      <div class="endpoint">📅 <a href="/api/events">/api/events</a> - Events</div>
      <div class="endpoint">📢 <a href="/api/notices">/api/notices</a> - Notices</div>
      <div class="endpoint">🖼️ <a href="/api/gallery">/api/gallery</a> - Gallery</div>
      <div class="endpoint">👥 <a href="/api/leadership">/api/leadership</a> - Leadership</div>
      <div class="endpoint">📋 <a href="/api/central-committee">/api/central-committee</a> - Central Committee</div>
    </div>
    
    <div class="footer">
      Version 1.0.0 | Environment: ${process.env.NODE_ENV || 'development'}
    </div>
  </div>
</body>
</html>`;
    fs.writeFileSync(indexPath, htmlContent);
    console.log('✅ Default index.html created in public directory');
  }
}

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==================== ROOT ROUTE HANDLER ====================

// Root route - serves index.html or returns API info
app.get('/', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      success: true,
      message: 'Nepali Sena API Server',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        superadmin: '/api/superadmin',
        news: '/api/news',
        events: '/api/events',
        notices: '/api/notices',
        gallery: '/api/gallery',
        leadership: '/api/leadership',
        'central-committee': '/api/central-committee',
        contact: '/api/contact',
        introduction: '/api/introduction',
        logos: '/api/logos',
        interviews: '/api/interviews',
        settings: '/api/settings',
        'contact-messages': '/api/contact-messages',
        hero: '/api/hero'
      },
      documentation: 'https://your-api-docs-url.com',
      status: 'running'
    });
  }
});

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/leadership', require('./routes/leadership'));
app.use('/api/central-committee', require('./routes/centralCommittee'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/introduction', require('./routes/introduction'));
app.use('/api/logos', require('./routes/logos'));
app.use('/api/news', require('./routes/news'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/superadmin', require('./routes/superAdmin'));
app.use('/api/contact-messages', require('./routes/contactMessages'));
app.use('/api/task-programs', require('./routes/taskProgram'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/faq-config', require('./routes/faqConfig'));
app.use('/api/training', require('./routes/training'));
app.use('/api/security-rules', require('./routes/securityRules'));

// Catch-all for API routes - 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    path: req.originalUrl
  });
});

// ==================== 404 HANDLER FOR NON-API ROUTES ====================

// If no static file found and not an API route, serve index.html (for SPA)
app.get('*', (req, res) => {
  // Check if the request is for an API route
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.originalUrl
    });
  }
  
  // For non-API routes, serve index.html if it exists (for client-side routing)
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      message: 'Page not found',
      path: req.originalUrl
    });
  }
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 50MB.',
    });
  }

  if (err.message && err.message.includes('Cloudinary')) {
    return res.status(500).json({
      success: false,
      message: 'Error uploading to Cloudinary. Please try again.',
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate value for ${field}. Please use a unique value.`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== CREATE DEFAULT ADMIN ====================

const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not set in .env - default admin not created');
      return;
    }

    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      await Admin.create({
        email: adminEmail,
        password: adminPassword,
      });
      console.log(`✅ Default admin created: ${adminEmail}`);
    } else {
      console.log('✅ Default admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

// ==================== CREATE DEFAULT SUPER ADMIN ====================

const createDefaultSuperAdmin = async () => {
  try {
    const SuperAdmin = require('./models/SuperAdmin');

    // Credentials come strictly from .env - never hardcoded
    const superEmail = process.env.SUPER_ADMIN_EMAIL;
    const superPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!superEmail || !superPassword) {
      console.log('⚠️  SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD not set in .env - default super admin not created');
      return;
    }

    const superExists = await SuperAdmin.findOne({ email: superEmail });
    if (!superExists) {
      await SuperAdmin.create({
        email: superEmail,
        password: superPassword,
      });
      console.log(`✅ Default super admin created: ${superEmail}`);
    } else {
      console.log('✅ Default super admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default super admin:', error.message);
  }
};

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log('='.repeat(60));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Super Admin: http://localhost:${PORT}/api/superadmin`);
  console.log(`🏠 Root URL: http://localhost:${PORT}/`);
  console.log('='.repeat(60));
  
  await createDefaultAdmin();
  await createDefaultSuperAdmin();
  
  console.log('='.repeat(60));
  console.log('✅ Server is ready to accept connections');
  console.log('='.repeat(60));
});

// ==================== PROCESS HANDLERS ====================

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT signal received: closing HTTP server');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;