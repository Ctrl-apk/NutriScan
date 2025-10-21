// Simulated AI engine - Replace with actual AI API (OpenAI, etc.)
export const generateSubstitutions = async (ingredient, userProfile) => {
  // AI logic to suggest substitutions based on user profile
  const substitutionDatabase = {
    'sugar': [
      {
        name: 'Stevia',
        healthScore: 9,
        reason: 'Zero calories, natural sweetener',
        dietCompatible: ['vegan', 'keto', 'normal'],
      },
      {
        name: 'Honey',
        healthScore: 7,
        reason: 'Natural, contains antioxidants',
        dietCompatible: ['normal', 'paleo'],
      },
      {
        name: 'Monk Fruit',
        healthScore: 9,
        reason: 'Zero calories, no blood sugar spike',
        dietCompatible: ['vegan', 'keto', 'normal'],
      },
    ],
    'msg': [
      {
        name: 'Sea Salt',
        healthScore: 8,
        reason: 'Natural flavor enhancer',
        dietCompatible: ['vegan', 'normal', 'keto'],
      },
      {
        name: 'Nutritional Yeast',
        healthScore: 9,
        reason: 'Umami flavor, rich in B vitamins',
        dietCompatible: ['vegan', 'vegetarian', 'normal'],
      },
    ],
    'palm oil': [
      {
        name: 'Olive Oil',
        healthScore: 10,
        reason: 'Heart-healthy, rich in omega-3',
        dietCompatible: ['vegan', 'normal', 'keto', 'paleo'],
      },
      {
        name: 'Coconut Oil',
        healthScore: 8,
        reason: 'Medium-chain triglycerides',
        dietCompatible: ['vegan', 'keto', 'paleo'],
      },
    ],
    'high fructose corn syrup': [
      {
        name: 'Maple Syrup',
        healthScore: 7,
        reason: 'Natural, contains minerals',
        dietCompatible: ['vegan', 'normal'],
      },
      {
        name: 'Date Syrup',
        healthScore: 8,
        reason: 'Rich in fiber and minerals',
        dietCompatible: ['vegan', 'normal', 'paleo'],
      },
    ],
  };

  const ingredient_lower = ingredient.toLowerCase();
  let substitutes = substitutionDatabase[ingredient_lower] || [];

  // Filter by user's diet type
  if (userProfile && userProfile.dietType) {
    substitutes = substitutes.filter(sub =>
      sub.dietCompatible.includes(userProfile.dietType)
    );
  }

  // Filter out allergens
  if (userProfile && userProfile.allergies) {
    substitutes = substitutes.filter(sub =>
      !userProfile.allergies.some(allergy =>
        sub.name.toLowerCase().includes(allergy.toLowerCase())
      )
    );
  }

  return substitutes;
};