import express from 'express';
import { protect } from '../middleware/auth.js';
import { getProfile, updateProfile, calculateBMI } from '../controllers/profileController.js';

const router = express.Router();

// All routes are protected (require JWT)
router.get('/:email', protect, getProfile);
router.put('/:email', protect, updateProfile);
router.get('/:email/bmi', protect, calculateBMI);

export default router;