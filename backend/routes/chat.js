import express from 'express';
import { protect } from '../middleware/auth.js';
import { askAboutIngredient, getIngredientFacts } from '../controllers/chatController.js';

const router = express.Router();

router.post('/ask', protect, askAboutIngredient);
router.get('/facts/:ingredient', protect, getIngredientFacts);

export default router;