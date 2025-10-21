import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  addMeal, 
  getTodayNutrition, 
  getNutritionHistory, 
  deleteMeal 
} from '../controllers/nutritionTrackerController.js';

const router = express.Router();

router.post('/meal', protect, addMeal);
router.get('/today', protect, getTodayNutrition);
router.get('/history', protect, getNutritionHistory);
router.delete('/meal/:mealId', protect, deleteMeal);

export default router;