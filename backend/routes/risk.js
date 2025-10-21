import express from 'express';
import { protect } from '../middleware/auth.js';
import { analyzeHealthRisk } from '../controllers/riskRatingController.js';

const router = express.Router();

router.post('/analyze', protect, analyzeHealthRisk);
// router.post('/quick-check', protect, quickRiskCheck);

export default router;