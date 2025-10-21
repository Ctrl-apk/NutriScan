import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, Target, Calendar } from 'lucide-react';
import api from '../utils/api';

const DailyNutritionTracker = () => {
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    mealType: 'breakfast',
    foodName: '',
    nutrients: {
      carbs: '',
      protein: '',
      fat: '',
      calories: '',
      fiber: '',
      sugar: '',
    },
  });

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const { data } = await api.get('/nutrition/today');
      setTodayData(data);
    } catch (err) {
      console.error('Fetch nutrition error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    
    // Convert strings to numbers
    const nutrients = {
      carbs: parseFloat(newMeal.nutrients.carbs) || 0,
      protein: parseFloat(newMeal.nutrients.protein) || 0,
      fat: parseFloat(newMeal.nutrients.fat) || 0,
      calories: parseFloat(newMeal.nutrients.calories) || 0,
      fiber: parseFloat(newMeal.nutrients.fiber) || 0,
      sugar: parseFloat(newMeal.nutrients.sugar) || 0,
    };

    try {
      await api.post('/nutrition/meal', {
        ...newMeal,
        nutrients,
      });
      
      // Reset form
      setNewMeal({
        mealType: 'breakfast',
        foodName: '',
        nutrients: { carbs: '', protein: '', fat: '', calories: '', fiber: '', sugar: '' },
      });
      setShowAddMeal(false);
      
      // Refresh data
      fetchTodayData();
    } catch (err) {
      alert('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Delete this meal?')) return;

    try {
      await api.delete(`/nutrition/meal/${mealId}`);
      fetchTodayData();
    } catch (err) {
      alert('Failed to delete meal');
    }
  };

  const getProgressPercentage = (current, goal) => {
    if (!goal) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading nutrition data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Daily Nutrition Tracker</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        {['calories', 'protein', 'carbs', 'fat'].map((nutrient) => {
          const current = todayData?.totals[nutrient] || 0;
          const goal = todayData?.goals[nutrient] || 0;
          const percentage = getProgressPercentage(current, goal);
          
          return (
            <div key={nutrient}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {nutrient}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {current.toFixed(0)} / {goal} {nutrient === 'calories' ? 'kcal' : 'g'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(percentage)} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Macro Summary Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {todayData?.totals.calories.toFixed(0)}
          </div>
          <div className="text-xs text-gray-600 mt-1">Calories</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center border-2 border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {todayData?.totals.protein.toFixed(0)}g
          </div>
          <div className="text-xs text-gray-600 mt-1">Protein</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 text-center border-2 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {todayData?.totals.carbs.toFixed(0)}g
          </div>
          <div className="text-xs text-gray-600 mt-1">Carbs</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 text-center border-2 border-orange-200">
          <div className="text-2xl font-bold text-orange-600">
            {todayData?.totals.fat.toFixed(0)}g
          </div>
          <div className="text-xs text-gray-600 mt-1">Fat</div>
        </div>
      </div>

      {/* Add Meal Button */}
      <button
        onClick={() => setShowAddMeal(!showAddMeal)}
        className="w-full mb-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add Meal</span>
      </button>

      {/* Add Meal Form */}
      {showAddMeal && (
        <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-4">Log New Meal</h3>
          <form onSubmit={handleAddMeal} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                <select
                  value={newMeal.mealType}
                  onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
                <input
                  type="text"
                  value={newMeal.foodName}
                  onChange={(e) => setNewMeal({ ...newMeal, foodName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Chicken Salad"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newMeal.nutrients.carbs}
                  onChange={(e) => setNewMeal({ 
                    ...newMeal, 
                    nutrients: { ...newMeal.nutrients, carbs: e.target.value }
                  })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newMeal.nutrients.protein}
                  onChange={(e) => setNewMeal({ 
                    ...newMeal, 
                    nutrients: { ...newMeal.nutrients, protein: e.target.value }
                  })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fat (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newMeal.nutrients.fat}
                  onChange={(e) => setNewMeal({ 
                    ...newMeal, 
                    nutrients: { ...newMeal.nutrients, fat: e.target.value }
                  })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  value={newMeal.nutrients.calories}
                  onChange={(e) => setNewMeal({ 
                    ...newMeal, 
                    nutrients: { ...newMeal.nutrients, calories: e.target.value }
                  })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fiber (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newMeal.nutrients.fiber}
                  onChange={(e) => setNewMeal({ 
                    ...newMeal, 
                    nutrients: { ...newMeal.nutrients, fiber: e.target.value }
                  })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sugar (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newMeal.nutrients.sugar}
                  onChange={(e) => setNewMeal({ 
                    ...newMeal, 
                    nutrients: { ...newMeal.nutrients, sugar: e.target.value }
                  })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Add Meal
              </button>
              <button
                type="button"
                onClick={() => setShowAddMeal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Meals List */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>Today's Meals</span>
        </h3>
        
        {todayData?.meals && todayData.meals.length > 0 ? (
          <div className="space-y-3">
            {todayData.meals.map((meal) => (
              <div
                key={meal._id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold capitalize">
                        {meal.mealType}
                      </span>
                      <span className="font-semibold text-gray-800">{meal.foodName}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center bg-gray-50 rounded p-1">
                        <div className="font-bold text-gray-700">{meal.nutrients.calories}</div>
                        <div className="text-gray-500">cal</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded p-1">
                        <div className="font-bold text-gray-700">{meal.nutrients.protein}g</div>
                        <div className="text-gray-500">protein</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded p-1">
                        <div className="font-bold text-gray-700">{meal.nutrients.carbs}g</div>
                        <div className="text-gray-500">carbs</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded p-1">
                        <div className="font-bold text-gray-700">{meal.nutrients.fat}g</div>
                        <div className="text-gray-500">fat</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(meal.time).toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal._id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Target className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No meals logged yet today</p>
            <p className="text-sm text-gray-500 mt-1">Start tracking your nutrition!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyNutritionTracker;