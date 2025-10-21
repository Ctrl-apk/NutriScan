import geminiService from '../services/geminiService.js';
import cacheService from '../services/cacheService.js';
import User from '../models/User.js';
import Scan from '../models/Scan.js';

/**
 * @desc    Get AI ingredient substitutions
 * @route   POST /api/ai/substitution
 * @access  Private
 */
export const getSubstitution = async (req, res, next) => {
  try {
    const { ingredient } = req.body;

    if (!ingredient || ingredient.trim().length === 0) {
      return res.status(400).json({ message: 'Ingredient is required' });
    }

    // Check cache first
    const cacheKey = cacheService.generateKey('substitution', ingredient, req.user._id);
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      return res.json({
        ...cached,
        cached: true,
      });
    }

    // Get user profile
    const user = await User.findById(req.user._id);

    // Call Gemini AI
    const substitutes = await geminiService.getSubstitutions(
      ingredient,
      user.healthProfile
    );

    const response = {
      ingredient,
      substitutes: Array.isArray(substitutes) ? substitutes : [],
      userDietType: user.healthProfile?.dietType || 'normal',
      personalized: true,
      aiProvider: 'Gemini',
    };

    // Cache for 1 hour
    cacheService.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    console.error('Substitution Error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to get AI suggestions',
      fallback: true
    });
  }
};

/**
 * @desc    Get mood-based recommendations
 * @route   POST /api/ai/mood
 * @access  Private
 */
export const getMoodRecommendations = async (req, res, next) => {
  try {
    const { mood } = req.body;

    const validMoods = ['happy', 'sad', 'stressed', 'energetic', 'tired', 'anxious', 'calm'];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ 
        message: 'Invalid mood',
        validMoods 
      });
    }

    // Check cache
    const cacheKey = cacheService.generateKey('mood', mood);
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      return res.json({
        ...cached,
        cached: true,
      });
    }

    // Call Gemini
    const recommendations = await geminiService.getMoodRecommendations(mood);

    const response = {
      mood,
      recommendations: Array.isArray(recommendations) ? recommendations : [],
      count: recommendations.length,
      aiProvider: 'Gemini',
    };

    // Cache for 2 hours
    cacheService.set(cacheKey, response, 7200);

    res.json(response);
  } catch (error) {
    console.error('Mood Error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to get recommendations',
      fallback: true
    });
  }
};

/**
 * @desc    Analyze health risk
 * @route   POST /api/ai/risk
 * @access  Private
 */
export const analyzeRisk = async (req, res, next) => {
  try {
    const { scanId } = req.body;

    if (!scanId) {
      return res.status(400).json({ message: 'Scan ID is required' });
    }

    // Get scan
    const scan = await Scan.findById(scanId);
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }

    // Verify ownership
    if (scan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check cache
    const cacheKey = cacheService.generateKey('risk', scanId);
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      return res.json({
        ...cached,
        cached: true,
      });
    }

    // Get user profile
    const user = await User.findById(req.user._id);

    // Call Gemini for risk analysis
    const riskAnalysis = await geminiService.analyzeHealthRisk(
      scan.results,
      user.healthProfile
    );

    const response = {
      scanId,
      productName: scan.productName || 'Scanned Product',
      ...riskAnalysis,
      aiProvider: 'Gemini',
      analyzedAt: new Date(),
    };

    // Cache for 30 minutes
    cacheService.set(cacheKey, response, 1800);

    res.json(response);
  } catch (error) {
    console.error('Risk Analysis Error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to analyze risk',
      fallback: true
    });
  }
};

/**
 * @desc    Chat with AI
 * @route   POST /api/ai/chat
 * @access  Private
 */
export const chatWithAI = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Check cache
    const cacheKey = cacheService.generateKey('chat', question);
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      return res.json({
        ...cached,
        cached: true,
      });
    }

    // Call Gemini
    const answer = await geminiService.chatAboutIngredient(question);

    const response = {
      question,
      answer,
      aiProvider: 'Gemini',
      timestamp: new Date(),
    };

    // Cache for 1 hour
    cacheService.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to get AI response',
      fallback: true
    });
  }
};

/**
 * @desc    Get AI service status
 * @route   GET /api/ai/status
 * @access  Public
 */
export const getAIStatus = async (req, res) => {
  const isConfigured = !!process.env.GEMINI_API_KEY;
  const cacheStats = cacheService.getStats();

  res.json({
    aiProvider: 'Google Gemini',
    configured: isConfigured,
    status: isConfigured ? 'operational' : 'not configured',
    cache: cacheStats,
    features: {
      substitution: isConfigured,
      moodRecommendations: isConfigured,
      riskAnalysis: isConfigured,
      chat: isConfigured,
    }
  });
};