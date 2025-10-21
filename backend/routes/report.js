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
import { rateLimiter } from '../middleware/rateLimiter.js';

router.post('/', protect, rateLimiter, submitReport);
// All routes are protected
router.post('/', protect, submitReport);
router.get('/', protect, getReports);
router.get('/my-reports', protect, getMyReports);
router.put('/:id/upvote', protect, upvoteReport);
router.delete('/:id', protect, deleteReport);

export default router;