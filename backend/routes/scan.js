import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth.js';
import Scan from '../models/Scan.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Load ingredients database
let ingredientsDB = [];
try {
  const ingredientsPath = path.join(__dirname, '../data/ingredients.json');
  ingredientsDB = JSON.parse(fs.readFileSync(ingredientsPath, 'utf-8'));
  console.log(`✓ Loaded ${ingredientsDB.length} ingredients from database`);
} catch (error) {
  console.error('✗ Error loading ingredients database:', error.message);
}

// Analyze ingredients
const analyzeIngredients = (extractedText) => {
  const text = extractedText.toLowerCase();
  const words = text.split(/[\s,;.()]+/).filter(word => word.length > 2);

  const results = {
    total: 0,
    safe: 0,
    moderate: 0,
    harmful: 0,
    details: []
  };

  const foundIngredients = new Set();

  ingredientsDB.forEach((ingredient) => {
    const ingredientName = ingredient.name.toLowerCase();
    
    const found = words.some(word => {
      return word.includes(ingredientName) || ingredientName.includes(word);
    });

    if (found && !foundIngredients.has(ingredientName)) {
      foundIngredients.add(ingredientName);
      results.total++;
      results.details.push({
        name: ingredient.name,
        risk: ingredient.risk
      });

      if (ingredient.risk === 'Safe') results.safe++;
      else if (ingredient.risk === 'Moderate') results.moderate++;
      else if (ingredient.risk === 'Harmful') results.harmful++;
    }
  });

  return results;
};

/**
 * @desc    Analyze ingredients from uploaded image
 * @route   POST /api/scan/analyze
 * @access  Private
 */
router.post('/analyze', protect, upload.single('image'), async (req, res) => {
  try {
    const { extractedText, productName } = req.body;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: 'No text extracted from image' });
    }

    // Analyze ingredients
    const results = analyzeIngredients(extractedText);

    if (results.total === 0) {
      return res.status(200).json({
        message: 'No known ingredients detected',
        results: {
          total: 0,
          safe: 0,
          moderate: 0,
          harmful: 0,
          details: []
        }
      });
    }

    // Save scan to database
    const scan = await Scan.create({
      user: req.user._id,
      imagePath: req.file ? req.file.path : null,
      extractedText,
      productName: productName || 'Unknown Product',
      results
    });

    res.status(201).json(scan);
  } catch (error) {
    console.error('Analyze Error:', error);
    
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Error analyzing ingredients' 
    });
  }
});

/**
 * @desc    Get scan history
 * @route   GET /api/scan/history
 * @access  Private
 */
router.get('/history', protect, async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-extractedText');

    res.json(scans);
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ message: 'Error fetching scan history' });
  }
});

/**
 * @desc    Get single scan
 * @route   GET /api/scan/:id
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }

    if (scan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(scan);
  } catch (error) {
    console.error('Get Scan Error:', error);
    res.status(500).json({ message: 'Error fetching scan' });
  }
});

/**
 * @desc    Delete scan
 * @route   DELETE /api/scan/:id
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }

    if (scan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (scan.imagePath && fs.existsSync(scan.imagePath)) {
      fs.unlink(scan.imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    await scan.deleteOne();
    res.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    console.error('Delete Scan Error:', error);
    res.status(500).json({ message: 'Error deleting scan' });
  }
});

export default router;