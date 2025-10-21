import Scan from '../models/Scan.js';
import User from '../models/User.js';

/**
 * AI-powered health risk calculation
 * @param {Object} scanResults - Scan results with ingredient details
 * @param {Object} userProfile - User's health profile
 * @returns {Object} Risk rating and recommendations
 */
const calculateHealthRisk = (scanResults, userProfile) => {
  let riskScore = 0;
  const riskFactors = [];
  const recommendations = [];

  // Base risk from harmful ingredients
  riskScore += scanResults.harmful * 15;
  riskScore += scanResults.moderate * 5;

  if (scanResults.harmful > 0) {
    riskFactors.push(`Contains ${scanResults.harmful} harmful ingredient(s)`);
    recommendations.push('Consider alternative products with fewer harmful additives');
  }

  // Check allergens
  if (userProfile && userProfile.allergies) {
    const allergenMatch = scanResults.details.filter(ingredient =>
      userProfile.allergies.some(allergy =>
        ingredient.name.toLowerCase().includes(allergy.toLowerCase())
      )
    );

    if (allergenMatch.length > 0) {
      riskScore += 30;
      riskFactors.push(`Contains allergens: ${allergenMatch.map(i => i.name).join(', ')}`);
      recommendations.push('⚠️ CRITICAL: Contains ingredients you\'re allergic to - DO NOT CONSUME');
    }
  }

  // Diet compatibility check
  if (userProfile && userProfile.dietType) {
    const incompatibleIngredients = {
      'vegan': ['milk', 'egg', 'honey', 'gelatin', 'whey', 'casein'],
      'vegetarian': ['gelatin', 'rennet'],
      'keto': ['sugar', 'wheat', 'rice', 'corn syrup'],
    };

    const dietIncompatible = incompatibleIngredients[userProfile.dietType] || [];
    const found = scanResults.details.filter(ingredient =>
      dietIncompatible.some(inc => ingredient.name.toLowerCase().includes(inc))
    );

    if (found.length > 0) {
      riskScore += 10;
      riskFactors.push(`Not compatible with ${userProfile.dietType} diet`);
      recommendations.push(`Contains ingredients not suitable for ${userProfile.dietType} diet`);
    }
  }

  // Health goals check
  if (userProfile && userProfile.healthGoals) {
    if (userProfile.healthGoals.includes('weight-loss')) {
      const highCalorieIngredients = scanResults.details.filter(ing =>
        ['sugar', 'palm oil', 'corn syrup'].includes(ing.name.toLowerCase())
      );
      if (highCalorieIngredients.length > 0) {
        riskScore += 10;
        riskFactors.push('Contains high-calorie ingredients');
        recommendations.push('Not ideal for weight loss goals');
      }
    }

    if (userProfile.healthGoals.includes('heart-health')) {
      const unhealthyFats = scanResults.details.filter(ing =>
        ['palm oil', 'trans fat', 'partially hydrogenated oil'].includes(ing.name.toLowerCase())
      );
      if (unhealthyFats.length > 0) {
        riskScore += 15;
        riskFactors.push('Contains unhealthy fats');
        recommendations.push('May negatively impact heart health');
      }
    }
  }

  // Calculate final risk level
  let riskLevel = 'Low';
  let riskColor = 'green';
  if (riskScore >= 50) {
    riskLevel = 'Critical';
    riskColor = 'red';
  } else if (riskScore >= 30) {
    riskLevel = 'High';
    riskColor = 'orange';
  } else if (riskScore >= 15) {
    riskLevel = 'Moderate';
    riskColor = 'yellow';
  }

  return {
    riskScore: Math.min(riskScore, 100),
    riskLevel,
    riskColor,
    riskFactors,
    recommendations: recommendations.length > 0 ? recommendations : ['This product appears safe for you'],
    safetyRating: Math.max(0, 100 - riskScore),
  };
};

/**
 * @desc    Get AI health risk rating for a scan
 * @route   POST /api/risk/analyze
 * @access  Private
 */
export const analyzeHealthRisk = async (req, res) => {
  try {
    const { scanId } = req.body;

    if (!scanId) {
      return res.status(400).json({ message: 'Scan ID is required' });
    }

    // Get scan results
    const scan = await Scan.findById(scanId);
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }

    // Get user profile
    const user = await User.findById(req.user._id);

    // Calculate risk
    const riskAnalysis = calculateHealthRisk(scan.results, user.healthProfile);

    res.json({
      scanId,
      productAnalyzed: true,
      ...riskAnalysis,
    });
  } catch (error) {
    console.error('Risk Analysis Error:', error);
    res.status(500).json({ message: 'Server error analyzing health risk' });
  }
};

/**
 * @desc    Get risk analysis for ingredient list
 * @route   POST /api/risk/quick-check
 * @access  Private
 */
export const quickRiskCheck = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Ingredients array is required' });
    }

    // Simulate scan results
    const mockResults = {
      total: ingredients.length,
      safe: 0,
      moderate: 0,
      harmful: 0,
      details: ingredients.map(ing => ({
        name: ing,
        risk: 'Safe', // Default, would be looked up in real scenario
      })),
    };

    const user = await User.findById(req.user._id);
    const riskAnalysis = calculateHealthRisk(mockResults, user.healthProfile);

    res.json(riskAnalysis);
  } catch (error) {
    console.error('Quick Risk Check Error:', error);
    res.status(500).json({ message: 'Server error performing quick check' });
  }
};