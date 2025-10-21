import Substitution from '../models/Substitution.js';
import User from '../models/User.js';
import { generateSubstitutions } from '../utils/aiEngine.js';

/**
 * @desc    Get AI-powered substitutions for an ingredient
 * @route   POST /api/substitution/suggest
 * @access  Private
 */
export const suggestSubstitutions = async (req, res) => {
  try {
    const { ingredient } = req.body;

    if (!ingredient) {
      return res.status(400).json({ message: 'Ingredient is required' });
    }

    // Get user profile for personalization
    const user = await User.findById(req.user._id);
    
    // Check if we have cached substitutions
    let substitution = await Substitution.findOne({ 
      ingredient: ingredient.toLowerCase() 
    });

    let substitutes;
    if (substitution) {
      substitutes = substitution.substitutes;
    } else {
      // Generate new substitutions using AI
      substitutes = await generateSubstitutions(ingredient, user.healthProfile);
      
      // Cache the result
      if (substitutes.length > 0) {
        await Substitution.create({
          ingredient: ingredient.toLowerCase(),
          substitutes,
          category: 'other', // You can add logic to determine category
        });
      }
    }

    res.json({
      ingredient,
      substitutes,
      userDietType: user.healthProfile?.dietType || 'normal',
    });
  } catch (error) {
    console.error('Substitution Error:', error);
    res.status(500).json({ message: 'Server error generating substitutions' });
  }
};

/**
 * @desc    Get all substitution suggestions
 * @route   GET /api/substitution
 * @access  Private
 */
export const getAllSubstitutions = async (req, res) => {
  try {
    const substitutions = await Substitution.find()
      .sort({ upvotes: -1 })
      .limit(50);

    res.json({ count: substitutions.length, substitutions });
  } catch (error) {
    console.error('Get Substitutions Error:', error);
    res.status(500).json({ message: 'Server error fetching substitutions' });
  }
};