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
connectDB();
const app = express();

// Validate AI configuration
const aiConfigured = validateGeminiConfig();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', // local dev
    'https://nutri-scan-ashen.vercel.app', // deployed frontend
    'https://nutri-scan-git-master-ctrl-apks-projects.vercel.app' // alternate URL
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Request logging for dev
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Root route
app.get('/', (req, res) => {
  res.send('NutriScan Backend is alive!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
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
  console.log(`NutriScan Backend running on port ${PORT}`);
  if (!aiConfigured) console.log('⚠️  AI Features Disabled: Add GEMINI_API_KEY to .env');
});

export default app;
