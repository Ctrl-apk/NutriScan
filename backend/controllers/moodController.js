import MoodRecommendation from '../models/MoodRecommendation.js';

// AI-powered mood-based food recommendations
const moodFoodMap = {
  happy: [
    {
      foodName: 'Dark Chocolate',
      nutrients: { carbs: 45, protein: 5, fat: 35, calories: 550 },
      reason: 'Contains phenylethylamine that boosts endorphins',
      emoji: '🍫',
    },
    {
      foodName: 'Berries',
      nutrients: { carbs: 12, protein: 1, fat: 0.3, calories: 50 },
      reason: 'Rich in antioxidants that support brain health',
      emoji: '🫐',
    },
    {
      foodName: 'Banana',
      nutrients: { carbs: 27, protein: 1.3, fat: 0.4, calories: 105 },
      reason: 'Contains vitamin B6 that helps produce dopamine',
      emoji: '🍌',
    },
  ],
  sad: [
    {
      foodName: 'Salmon',
      nutrients: { carbs: 0, protein: 25, fat: 13, calories: 206 },
      reason: 'Omega-3 fatty acids support mood regulation',
      emoji: '🐟',
    },
    {
      foodName: 'Oatmeal',
      nutrients: { carbs: 66, protein: 17, fat: 7, calories: 389 },
      reason: 'Complex carbs boost serotonin production',
      emoji: '🥣',
    },
    {
      foodName: 'Walnuts',
      nutrients: { carbs: 14, protein: 15, fat: 65, calories: 654 },
      reason: 'High in omega-3s for brain health',
      emoji: '🌰',
    },
  ],
  stressed: [
    {
      foodName: 'Green Tea',
      nutrients: { carbs: 0, protein: 0, fat: 0, calories: 2 },
      reason: 'L-theanine promotes relaxation without drowsiness',
      emoji: '🍵',
    },
    {
      foodName: 'Avocado',
      nutrients: { carbs: 9, protein: 2, fat: 15, calories: 160 },
      reason: 'B vitamins help reduce stress hormones',
      emoji: '🥑',
    },
    {
      foodName: 'Sweet Potato',
      nutrients: { carbs: 26, protein: 2, fat: 0.2, calories: 112 },
      reason: 'Complex carbs stabilize cortisol levels',
      emoji: '🍠',
    },
  ],
  energetic: [
    {
      foodName: 'Almonds',
      nutrients: { carbs: 22, protein: 21, fat: 50, calories: 579 },
      reason: 'Magnesium and protein sustain energy',
      emoji: '🌰',
    },
    {
      foodName: 'Greek Yogurt',
      nutrients: { carbs: 9, protein: 10, fat: 0.4, calories: 59 },
      reason: 'Protein-rich for sustained energy',
      emoji: '🥛',
    },
    {
      foodName: 'Apple',
      nutrients: { carbs: 25, protein: 0.5, fat: 0.3, calories: 95 },
      reason: 'Natural sugars for quick, healthy energy',
      emoji: '🍎',
    },
  ],
  tired: [
    {
      foodName: 'Spinach',
      nutrients: { carbs: 3.6, protein: 2.9, fat: 0.4, calories: 23 },
      reason: 'Iron helps combat fatigue',
      emoji: '🥬',
    },
    {
      foodName: 'Eggs',
      nutrients: { carbs: 1.1, protein: 13, fat: 11, calories: 155 },
      reason: 'B vitamins boost energy metabolism',
      emoji: '🥚',
    },
    {
      foodName: 'Coffee',
      nutrients: { carbs: 0, protein: 0, fat: 0, calories: 2 },
      reason: 'Caffeine provides quick alertness boost',
      emoji: '☕',
    },
  ],
  anxious: [
    {
      foodName: 'Chamomile Tea',
      nutrients: { carbs: 0, protein: 0, fat: 0, calories: 2 },
      reason: 'Natural calming properties reduce anxiety',
      emoji: '🫖',
    },
    {
      foodName: 'Turkey',
      nutrients: { carbs: 0, protein: 29, fat: 7, calories: 189 },
      reason: 'Tryptophan promotes calmness',
      emoji: '🦃',
    },
    {
      foodName: 'Blueberries',
      nutrients: { carbs: 14, protein: 1, fat: 0.5, calories: 57 },
      reason: 'Antioxidants reduce stress hormones',
      emoji: '🫐',
    },
  ],
  calm: [
    {
      foodName: 'Herbal Tea',
      nutrients: { carbs: 0, protein: 0, fat: 0, calories: 2 },
      reason: 'Maintains peaceful state',
      emoji: '🍵',
    },
    {
      foodName: 'Quinoa',
      nutrients: { carbs: 64, protein: 14, fat: 6, calories: 368 },
      reason: 'Balanced nutrition supports calm mood',
      emoji: '🌾',
    },
    {
      foodName: 'Cucumber',
      nutrients: { carbs: 3.6, protein: 0.7, fat: 0.1, calories: 16 },
      reason: 'Hydrating and cooling effect',
      emoji: '🥒',
    },
  ],
};

/**
 * @desc    Get mood-based food recommendations
 * @route   POST /api/mood/recommend
 * @access  Private
 */
export const getMoodRecommendations = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood || !moodFoodMap[mood]) {
      return res.status(400).json({ 
        message: 'Invalid mood. Choose from: happy, sad, stressed, energetic, tired, anxious, calm' 
      });
    }

    const recommendations = moodFoodMap[mood];

    // Save recommendation to history
    await MoodRecommendation.create({
      user: req.user._id,
      mood,
      recommendations,
    });

    res.json({
      mood,
      recommendations,
      message: `Here are foods to support your ${mood} mood!`,
    });
  } catch (error) {
    console.error('Mood Recommendation Error:', error);
    res.status(500).json({ message: 'Server error generating recommendations' });
  }
};

/**
 * @desc    Get mood recommendation history
 * @route   GET /api/mood/history
 * @access  Private
 */
export const getMoodHistory = async (req, res) => {
  try {
    const history = await MoodRecommendation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ count: history.length, history });
  } catch (error) {
    console.error('Mood History Error:', error);
    res.status(500).json({ message: 'Server error fetching mood history' });
  }
};