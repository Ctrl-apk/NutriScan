import express from 'express';
import { protect } from '../middleware/auth.js';
import { getMoodRecommendations, getMoodHistory } from '../controllers/moodController.js';

const router = express.Router();

router.post('/recommend', protect, getMoodRecommendations);
router.get('/history', protect, getMoodHistory);

export default router;