import DailyNutrition from '../models/DailyNutrition.js';
import User from '../models/User.js';
import { calculateNutritionGoals } from '../utils/nutritionCalculator.js';

/**
 * @desc    Add meal to daily tracker
 * @route   POST /api/nutrition/meal
 * @access  Private
 */
export const addMeal = async (req, res) => {
  try {
    const { mealType, foodName, nutrients } = req.body;

    if (!mealType || !foodName || !nutrients) {
      return res.status(400).json({ message: 'Meal type, food name, and nutrients are required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's nutrition entry
    let dailyNutrition = await DailyNutrition.findOne({
      user: req.user._id,
      date: today,
    });

    if (!dailyNutrition) {
      // Get user profile for goals
      const user = await User.findById(req.user._id);
      const goals = user.healthProfile 
        ? calculateNutritionGoals(user.healthProfile)
        : { calories: 2000, protein: 50, carbs: 250, fat: 70 };

      dailyNutrition = new DailyNutrition({
        user: req.user._id,
        date: today,
        meals: [],
        goals,
      });
    }

    // Add meal
    dailyNutrition.meals.push({
      mealType,
      foodName,
      nutrients,
      time: new Date(),
    });

    // Recalculate totals
    dailyNutrition.calculateTotals();
    await dailyNutrition.save();

    res.status(201).json({
      message: 'Meal added successfully',
      dailyNutrition,
    });
  } catch (error) {
    console.error('Add Meal Error:', error);
    res.status(500).json({ message: 'Server error adding meal' });
  }
};

/**
 * @desc    Get today's nutrition data
 * @route   GET /api/nutrition/today
 * @access  Private
 */
export const getTodayNutrition = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyNutrition = await DailyNutrition.findOne({
      user: req.user._id,
      date: today,
    });

    if (!dailyNutrition) {
      // Create empty entry with goals
      const user = await User.findById(req.user._id);
      const goals = user.healthProfile 
        ? calculateNutritionGoals(user.healthProfile)
        : { calories: 2000, protein: 50, carbs: 250, fat: 70 };

      dailyNutrition = new DailyNutrition({
        user: req.user._id,
        date: today,
        meals: [],
        goals,
        totals: { carbs: 0, protein: 0, fat: 0, calories: 0, fiber: 0, sugar: 0 },
      });

      await dailyNutrition.save();
    }

    res.json(dailyNutrition);
  } catch (error) {
    console.error('Get Today Nutrition Error:', error);
    res.status(500).json({ message: 'Server error fetching nutrition data' });
  }
};

/**
 * @desc    Get nutrition history (last 7 days)
 * @route   GET /api/nutrition/history
 * @access  Private
 */
export const getNutritionHistory = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const history = await DailyNutrition.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: -1 });

    res.json({ count: history.length, history });
  } catch (error) {
    console.error('Get Nutrition History Error:', error);
    res.status(500).json({ message: 'Server error fetching nutrition history' });
  }
};

/**
 * @desc    Delete a meal
 * @route   DELETE /api/nutrition/meal/:mealId
 * @access  Private
 */
export const deleteMeal = async (req, res) => {
  try {
    const { mealId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyNutrition = await DailyNutrition.findOne({
      user: req.user._id,
      date: today,
    });

    if (!dailyNutrition) {
      return res.status(404).json({ message: 'No nutrition data found for today' });
    }

    // Remove meal
    dailyNutrition.meals = dailyNutrition.meals.filter(
      meal => meal._id.toString() !== mealId
    );

    // Recalculate totals
    dailyNutrition.calculateTotals();
    await dailyNutrition.save();

    res.json({ message: 'Meal deleted successfully', dailyNutrition });
  } catch (error) {
    console.error('Delete Meal Error:', error);
    res.status(500).json({ message: 'Server error deleting meal' });
  }
};