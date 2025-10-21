import { useState } from 'react';
import { Lightbulb, Search, TrendingUp, Heart, Loader } from 'lucide-react';
import { callGPT } from '../utils/gptService';

const AISubstitution = () => {
  const [ingredient, setIngredient] = useState('');
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ingredient.trim()) {
      setError('Please enter an ingredient');
      return;
    }

    setLoading(true);
    setError('');
    setSubstitutes([]);

    try {
      // ========== GPT PROMPT ========== 
      const prompt = `Give me the 3 best and safest alternatives to "${ingredient}" as a food ingredient. 
      
For each alternative, provide:
1. Name of the substitute
2. Health score (1-10, where 10 is healthiest)
3. Reason why it's better
4. Compatible diet types (from: vegan, vegetarian, keto, paleo, normal)

Format your response as a JSON array like this:
[
  {
    "name": "Substitute Name",
    "healthScore": 9,
    "reason": "Brief explanation of why it's healthier",
    "dietCompatible": ["vegan", "keto", "normal"]
  }
]

Only return the JSON array, no additional text.`;
      // ================================

      const response = await callGPT(prompt, 800);
      
      // Parse GPT response
      // Clean and parse GPT response safely
let cleaned = response.trim();

// Remove Markdown-style code blocks (```json ... ```)
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

      
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        setSubstitutes(parsedData);
      } else {
        setError('No substitutions found. Try another ingredient.');
      }
    } catch (err) {
      console.error('GPT Error:', err);
      setError('Failed to get AI suggestions. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'bg-green-500';
    if (score >= 7) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Lightbulb className="w-8 h-8 text-yellow-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Ingredient Substitution</h2>
          <p className="text-sm text-gray-600">Powered by GPT-3.5 Turbo</p>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
            placeholder="Enter harmful ingredient (e.g., sugar, MSG, palm oil)"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Find Substitutes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 mx-auto text-yellow-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">AI is analyzing alternatives...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        </div>
      )}

      {/* Results */}
      {!loading && substitutes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              AI-Recommended Alternatives for "{ingredient}"
            </h3>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {substitutes.length} option{substitutes.length > 1 && 's'}
            </span>
          </div>

          {substitutes.map((sub, idx) => (
            <div
              key={idx}
              className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-yellow-300 transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition">
                    {sub.name}
                  </h4>
                  <p className="text-sm text-gray-600">{sub.reason}</p>
                </div>
                
                {/* Health Score */}
                <div className="ml-4 flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreColor(sub.healthScore)} flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl font-bold text-white">
                      {sub.healthScore}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Health Score</span>
                </div>
              </div>

              {/* Diet Compatibility Tags */}
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Compatible with:</span>
                </div>
                {sub.dietCompatible.map((diet, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold capitalize border border-green-300"
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
        <div className="flex items-start space-x-2">
          <Heart className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <strong>AI-Powered Tips:</strong> Our AI analyzes thousands of nutrition databases to provide personalized, safe alternatives based on your health profile and dietary preferences.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISubstitution;