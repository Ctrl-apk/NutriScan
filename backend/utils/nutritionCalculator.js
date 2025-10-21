// Calculate daily nutrition goals based on user profile
export const calculateNutritionGoals = (userProfile) => {
  const { age, weight, height, activityLevel, healthGoals } = userProfile;

  if (!weight || !height || !age) {
    // Default goals
    return {
      calories: 2000,
      protein: 50,
      carbs: 250,
      fat: 70,
    };
  }

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // For males (adjust for females: -161)

  // Activity multiplier
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.55;
  let calories = Math.round(bmr * multiplier);

  // Adjust for health goals
  if (healthGoals && healthGoals.includes('weight-loss')) {
    calories -= 500; // Calorie deficit
  } else if (healthGoals && healthGoals.includes('muscle-gain')) {
    calories += 300; // Calorie surplus
  }

  // Calculate macros (40/30/30 split)
  const protein = Math.round((calories * 0.30) / 4); // 4 cal/g
  const carbs = Math.round((calories * 0.40) / 4);
  const fat = Math.round((calories * 0.30) / 9); // 9 cal/g

  return { calories, protein, carbs, fat };
};