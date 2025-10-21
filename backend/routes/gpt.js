import express from 'express';
import { protect } from '../middleware/auth.js';
import { getSubstitution, getMoodRecommendations, chatWithAI } from '../controllers/gptController.js';

const router = express.Router();

router.post('/substitution', protect, getSubstitution);
router.post('/mood', protect, getMoodRecommendations);
router.post('/chat', protect, chatWithAI);

export default router;