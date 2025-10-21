import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const NutritionChart = ({ data, type = 'pie' }) => {
  // Default data if not provided
  const nutritionData = data || {
    carbs: 40,
    protein: 30,
    fat: 30,
  };

  const chartData = [
    { name: 'Carbs', value: nutritionData.carbs, color: '#3b82f6' },
    { name: 'Protein', value: nutritionData.protein, color: '#10b981' },
    { name: 'Fat', value: nutritionData.fat, color: '#f59e0b' },
  ];

  const barData = [
    { nutrient: 'Carbs', grams: nutritionData.carbs },
    { nutrient: 'Protein', grams: nutritionData.protein },
    { nutrient: 'Fat', grams: nutritionData.fat },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <PieIcon className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Nutrition Breakdown</h2>
        </div>
        <div className="text-sm text-gray-600">
          Total: {nutritionData.carbs + nutritionData.protein + nutritionData.fat}g
        </div>
      </div>

      {type === 'pie' ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Macros Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{nutritionData.carbs}g</div>
              <div className="text-sm text-gray-600 mt-1">Carbohydrates</div>
              <div className="text-xs text-gray-500 mt-1">
                {((nutritionData.carbs / (nutritionData.carbs + nutritionData.protein + nutritionData.fat)) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-3xl font-bold text-green-600">{nutritionData.protein}g</div>
              <div className="text-sm text-gray-600 mt-1">Protein</div>
              <div className="text-xs text-gray-500 mt-1">
                {((nutritionData.protein / (nutritionData.carbs + nutritionData.protein + nutritionData.fat)) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">{nutritionData.fat}g</div>
              <div className="text-sm text-gray-600 mt-1">Fat</div>
              <div className="text-xs text-gray-500 mt-1">
                {((nutritionData.fat / (nutritionData.carbs + nutritionData.protein + nutritionData.fat)) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nutrient" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="grams" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Calorie Estimation */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estimated Calories:</span>
          <span className="text-2xl font-bold text-purple-600">
            {(nutritionData.carbs * 4 + nutritionData.protein * 4 + nutritionData.fat * 9).toFixed(0)} kcal
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Based on: Carbs (4 kcal/g) + Protein (4 kcal/g) + Fat (9 kcal/g)
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;