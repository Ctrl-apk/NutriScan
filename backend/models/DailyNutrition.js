import mongoose from 'mongoose';

const dailyNutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    },
  },
  meals: [{
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    foodName: String,
    nutrients: {
      carbs: Number,
      protein: Number,
      fat: Number,
      calories: Number,
      fiber: Number,
      sugar: Number,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  }],
  totals: {
    carbs: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
  },
  goals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
}, {
  timestamps: true,
});

// Compound index for user and date
dailyNutritionSchema.index({ user: 1, date: -1 });

// Method to calculate totals
dailyNutritionSchema.methods.calculateTotals = function() {
  this.totals = this.meals.reduce((acc, meal) => ({
    carbs: acc.carbs + (meal.nutrients.carbs || 0),
    protein: acc.protein + (meal.nutrients.protein || 0),
    fat: acc.fat + (meal.nutrients.fat || 0),
    calories: acc.calories + (meal.nutrients.calories || 0),
    fiber: acc.fiber + (meal.nutrients.fiber || 0),
    sugar: acc.sugar + (meal.nutrients.sugar || 0),
  }), { carbs: 0, protein: 0, fat: 0, calories: 0, fiber: 0, sugar: 0 });
};

export default mongoose.model('DailyNutrition', dailyNutritionSchema);