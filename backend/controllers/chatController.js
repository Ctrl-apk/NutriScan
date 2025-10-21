// Simulated AI chat - Replace with OpenAI API or similar
const ingredientKnowledgeBase = {
  'sugar': {
    fullName: 'Sucrose',
    description: 'A simple carbohydrate that provides quick energy but can cause blood sugar spikes.',
    healthEffects: [
      'Can lead to weight gain if consumed in excess',
      'May increase risk of type 2 diabetes',
      'Can contribute to tooth decay',
      'Provides quick energy but no nutritional value'
    ],
    alternatives: ['Stevia', 'Monk Fruit', 'Erythritol', 'Xylitol'],
    safeIntake: 'Max 25g/day for women, 36g/day for men (American Heart Association)',
  },
  'msg': {
    fullName: 'Monosodium Glutamate',
    description: 'A flavor enhancer that adds umami taste to foods.',
    healthEffects: [
      'May cause headaches in sensitive individuals',
      'Can trigger MSG symptom complex in some people',
      'Generally recognized as safe by FDA',
      'High sodium content'
    ],
    alternatives: ['Sea Salt', 'Nutritional Yeast', 'Mushroom Powder', 'Soy Sauce'],
    safeIntake: 'FDA considers it GRAS (Generally Recognized as Safe) in normal amounts',
  },
  'palm oil': {
    fullName: 'Palm Oil',
    description: 'A vegetable oil derived from the fruit of oil palm trees.',
    healthEffects: [
      'High in saturated fats',
      'May increase LDL cholesterol',
      'Environmental concerns with production',
      'Contains vitamin E and antioxidants'
    ],
    alternatives: ['Olive Oil', 'Coconut Oil', 'Avocado Oil', 'Sunflower Oil'],
    safeIntake: 'Limit saturated fat intake to less than 10% of total calories',
  },
  'aspartame': {
    fullName: 'Aspartame',
    description: 'An artificial sweetener about 200 times sweeter than sugar.',
    healthEffects: [
      'Zero calories',
      'Not suitable for people with phenylketonuria (PKU)',
      'May cause headaches in sensitive individuals',
      'Extensive safety testing by FDA'
    ],
    alternatives: ['Stevia', 'Monk Fruit', 'Erythritol'],
    safeIntake: 'ADI: 50mg per kg body weight per day (FDA)',
  },
};

/**
 * @desc    Get ingredient explanation
 * @route   POST /api/chat/ask
 * @access  Private
 */
export const askAboutIngredient = async (req, res) => {
  try {
    const { ingredient, question } = req.body;

    if (!ingredient) {
      return res.status(400).json({ message: 'Ingredient name is required' });
    }

    const ingredientLower = ingredient.toLowerCase();
    const knowledgeEntry = ingredientKnowledgeBase[ingredientLower];

    if (!knowledgeEntry) {
      return res.json({
        ingredient,
        found: false,
        answer: `I don't have detailed information about "${ingredient}" in my database yet. However, I recommend checking with a nutritionist or researching from reliable sources like FDA or WHO.`,
      });
    }

    // Generate contextual answer based on question
    let answer = '';
    if (question && question.toLowerCase().includes('alternative')) {
      answer = `For ${ingredient}, healthier alternatives include: ${knowledgeEntry.alternatives.join(', ')}. These options provide similar functionality with potentially better health profiles.`;
    } else if (question && question.toLowerCase().includes('safe')) {
      answer = `${knowledgeEntry.safeIntake}. ${knowledgeEntry.description}`;
    } else {
      answer = `${knowledgeEntry.fullName}: ${knowledgeEntry.description}\n\nHealth Effects:\n${knowledgeEntry.healthEffects.map((effect, i) => `${i + 1}. ${effect}`).join('\n')}\n\nAlternatives: ${knowledgeEntry.alternatives.join(', ')}\n\nSafe Intake: ${knowledgeEntry.safeIntake}`;
    }

    res.json({
      ingredient,
      found: true,
      answer,
      details: knowledgeEntry,
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Server error processing question' });
  }
};

/**
 * @desc    Get quick facts about ingredient
 * @route   GET /api/chat/facts/:ingredient
 * @access  Private
 */
export const getIngredientFacts = async (req, res) => {
  try {
    const { ingredient } = req.params;
    const ingredientLower = ingredient.toLowerCase();
    const knowledgeEntry = ingredientKnowledgeBase[ingredientLower];

    if (!knowledgeEntry) {
      return res.status(404).json({ message: 'Ingredient not found in database' });
    }

    res.json(knowledgeEntry);
  } catch (error) {
    console.error('Get Facts Error:', error);
    res.status(500).json({ message: 'Server error fetching facts' });
  }
};