import { callGPT } from '../utils/gptService.js';

/**
 * @desc    Get AI substitution suggestions
 * @route   POST /api/gpt/substitution
 * @access  Private
 */
export const getSubstitution = async (req, res) => {
  try {
    const { ingredient } = req.body;

    if (!ingredient) {
      return res.status(400).json({ message: 'Ingredient is required' });
    }

    const prompt = `Give me the 3 best and safest alternatives to "${ingredient}" as a food ingredient. 
      
For each alternative, provide:
1. Name of the substitute
2. Health score (1-10)
3. Reason why it's better
4. Compatible diet types (vegan, vegetarian, keto, paleo, normal)

Format as JSON array:
[
  {
    "name": "Substitute Name",
    "healthScore": 9,
    "reason": "Brief explanation",
    "dietCompatible": ["vegan", "keto"]
  }
]

Only return the JSON array.`;

    const response = await callGPT(prompt, 800);
    const parsedData = JSON.parse(response);

    res.json({
      ingredient,
      substitutes: parsedData,
    });
  } catch (error) {
    console.error('Substitution Error:', error);
    res.status(500).json({ message: 'Failed to get AI suggestions' });
  }
};

/**
 * @desc    Get mood-based food recommendations
 * @route   POST /api/gpt/mood
 * @access  Private
 */
export const getMoodRecommendations = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    const prompt = `I'm feeling ${mood}. Recommend 3 foods that will help improve my mood.

For each food, provide:
1. Food name
2. Nutrients (carbs, protein, fat, calories)
3. Reason why it helps
4. An emoji

Format as JSON array:
[
  {
    "foodName": "Food Name",
    "nutrients": {"carbs": 27, "protein": 5, "fat": 3, "calories": 150},
    "reason": "Scientific explanation",
    "emoji": "🍎"
  }
]`;

    const response = await callGPT(prompt, 1000);
    const parsedData = JSON.parse(response);

    res.json({
      mood,
      recommendations: parsedData,
    });
  } catch (error) {
    console.error('Mood Recommendation Error:', error);
    res.status(500).json({ message: 'Failed to get AI recommendations' });
  }
};

/**
 * @desc    Chat with AI about ingredients
 * @route   POST /api/gpt/chat
 * @access  Private
 */
export const chatWithAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const prompt = `${question}

Provide a comprehensive answer about this food ingredient including:
1. What it is
2. Health effects
3. Safe intake levels
4. Alternatives (if harmful)
5. Diet compatibility

Keep answer concise (under 200 words).`;

    const response = await callGPT(prompt, 600);

    res.json({
      question,
      answer: response,
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Failed to get AI response' });
  }
};