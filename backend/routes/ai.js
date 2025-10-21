import express from 'express';
import { protect } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import {
  getSubstitution,
  getMoodRecommendations,
  analyzeRisk,
  chatWithAI,
  getAIStatus,
} from '../controllers/aiController.js';

const router = express.Router();

// Public route
router.get('/status', getAIStatus);

// Protected routes with rate limiting
router.use(protect);
router.use(rateLimiter(20, 60000));

router.post('/substitution', getSubstitution);
router.post('/mood', getMoodRecommendations);
router.post('/risk', analyzeRisk);
router.post('/chat', chatWithAI);

export default router;