import { useState } from 'react';
import { Smile, Frown, Zap, Coffee, Brain, HeartPulse, Sparkles, Loader } from 'lucide-react';
import { callGPT } from '../utils/gptService';

const MoodBasedRecommendation = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const moods = [
    { name: 'happy', icon: Smile, color: 'bg-yellow-500', label: 'Happy 😊' },
    { name: 'sad', icon: Frown, color: 'bg-blue-500', label: 'Sad 😢' },
    { name: 'stressed', icon: Brain, color: 'bg-red-500', label: 'Stressed 😰' },
    { name: 'energetic', icon: Zap, color: 'bg-orange-500', label: 'Energetic ⚡' },
    { name: 'tired', icon: Coffee, color: 'bg-purple-500', label: 'Tired 😴' },
    { name: 'anxious', icon: HeartPulse, color: 'bg-pink-500', label: 'Anxious 😟' },
    { name: 'calm', icon: Sparkles, color: 'bg-green-500', label: 'Calm 😌' },
  ];

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setRecommendations([]);

    try {
      // ========== GPT PROMPT ========== 
      const prompt = `I'm feeling ${mood}. Recommend 3 foods that will help improve my mood and well-being.

For each food, provide:
1. Food name
2. Nutrients (carbs, protein, fat, calories in grams/numbers)
3. Reason why it helps with ${mood} mood
4. An emoji that represents the food

Format as JSON array:
[
  {
    "foodName": "Food Name",
    "nutrients": {
      "carbs": 27,
      "protein": 5,
      "fat": 3,
      "calories": 150
    },
    "reason": "Brief scientific explanation",
    "emoji": "🍎"
  }
]

Only return the JSON array, no additional text.`;
      // ================================

      const response = await callGPT(prompt, 1000);
      let cleaned = response.trim();
if (cleaned.startsWith('```')) {
  cleaned = cleaned.replace(/```json|```/g, '').trim();
}
let parsedData;
try {
  parsedData = JSON.parse(cleaned);
} catch (e) {
  console.error('Invalid JSON from GPT:', cleaned);
  throw new Error('Invalid JSON format in GPT response.');
}

      
      if (Array.isArray(parsedData)) {
        setRecommendations(parsedData);
      }
    } catch (err) {
      console.error('GPT Error:', err);
      alert('Failed to get AI recommendations. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Smile className="w-8 h-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mood-Based Food Recommendations</h2>
          <p className="text-sm text-gray-600">AI-powered nutrition for your emotions</p>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="mb-6">
        <p className="text-gray-700 mb-4 font-medium">How are you feeling today?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.name}
                onClick={() => handleMoodSelect(mood.name)}
                disabled={loading}
                className={`p-4 rounded-xl border-2 transition transform hover:scale-105 disabled:opacity-50 ${
                  selectedMood === mood.name
                    ? `${mood.color} text-white border-transparent shadow-lg`
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${selectedMood === mood.name ? 'text-white' : 'text-gray-600'}`} />
                <span className="text-sm font-semibold">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 mx-auto text-purple-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">AI is finding the perfect foods for you...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing mood and nutrition data...</p>
        </div>
      )}

      {/* Recommendations */}
      {!loading && recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              AI Recommendations for your {selectedMood} mood:
            </h3>
          </div>

          {recommendations.map((food, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-purple-200 rounded-xl p-5 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{food.emoji}</span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{food.foodName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{food.reason}</p>
                  </div>
                </div>
              </div>

              {/* Nutrition Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-blue-600">{food.nutrients.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-600">{food.nutrients.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-yellow-600">{food.nutrients.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-purple-600">{food.nutrients.calories}</div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {!loading && recommendations.length === 0 && !selectedMood && (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-purple-300">
          <Sparkles className="w-16 h-16 mx-auto text-purple-400 mb-4" />
          <p className="text-gray-600">Select your mood to get AI-powered food recommendations</p>
          <p className="text-sm text-gray-500 mt-2">Powered by advanced nutrition science</p>
        </div>
      )}
    </div>
  );
};

export default MoodBasedRecommendation;