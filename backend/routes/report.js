import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  submitReport, 
  getReports, 
  getMyReports, 
  upvoteReport, 
  deleteReport 
} from '../controllers/reportController.js';

const router = express.Router();

// Remove rateLimiter from POST route - it's causing the timeout
router.post('/', protect, submitReport);
router.get('/', protect, getReports);
router.get('/my-reports', protect, getMyReports);
router.put('/:id/upvote', protect, upvoteReport);
router.delete('/:id', protect, deleteReport);

export default router;