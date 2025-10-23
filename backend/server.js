import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';
import { validateGeminiConfig } from './config/gemini.js';

// Routes
import authRoutes from './routes/auth.js';
import scanRoutes from './routes/scan.js';
import profileRoutes from './routes/profile.js';
import reportRoutes from './routes/report.js';
import nutritionRoutes from './routes/nutrition.js';
import aiRoutes from './routes/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Validate AI configuration (non-blocking)
const aiConfigured = validateGeminiConfig();

// Connect to database
connectDB();

const app = express();


const allowedOrigins = [
  'http://localhost:3000', // local dev
  'https://nutri-scan-ashen.vercel.app', // first Vercel frontend
  'https://nutri-scan-git-master-ctrl-apks-projects.vercel.app', // second Vercel frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin like mobile apps or curl
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✓ Uploads directory created');
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'NutriScan 2.0 API Running',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: {
      authentication: true,
      scanning: true,
      aiPowered: aiConfigured,
      nutritionTracking: true,
      communityReports: true,
    },
    aiProvider: aiConfigured ? 'Google Gemini' : 'Not configured',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🚀 NutriScan 2.0 Production Server          ║
║                                                ║
║   Port: ${PORT}                                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   AI: ${aiConfigured ? 'Google Gemini ✓' : 'Not Configured ⚠️'}           ║
║   Database: ${process.env.MONGO_URI ? 'MongoDB Atlas ✓' : 'Not Connected ⚠️'}      ║
║                                                ║
║   Status: Server Running 🟢                    ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
  
  if (!aiConfigured) {
    console.log('\n⚠️  AI Features Disabled: Add GEMINI_API_KEY to .env\n');
  }
});

export default app;