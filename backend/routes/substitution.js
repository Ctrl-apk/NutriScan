import express from 'express';
import { protect } from '../middleware/auth.js';
import { suggestSubstitutions, getAllSubstitutions } from '../controllers/substitutionController.js';

const router = express.Router();

router.post('/suggest', protect, suggestSubstitutions);
router.get('/', protect, getAllSubstitutions);

export default router;