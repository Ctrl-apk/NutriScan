import { useState } from 'react';
import { Shield, AlertTriangle, TrendingDown, Check } from 'lucide-react';
import api from '../utils/api';

const HealthRiskRating = ({ scanId, initialResults }) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeRisk = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/risk/analyze', { scanId });
      setRiskData(data);
    } catch (err) {
      alert('Failed to analyze health risk');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColorClasses = (color) => {
    const colors = {
      green: 'from-green-500 to-emerald-500 border-green-300',
      yellow: 'from-yellow-500 to-orange-500 border-yellow-300',
      orange: 'from-orange-500 to-red-500 border-orange-300',
      red: 'from-red-500 to-pink-500 border-red-300',
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">AI Health Risk Rating</h2>
      </div>

      {!riskData ? (
        <div className="text-center py-12">
          <Shield className="w-20 h-20 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-6">Get AI-powered personalized health risk analysis</p>
          <button
            onClick={analyzeRisk}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Health Risk'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Risk Score Card */}
          <div className={`bg-gradient-to-r ${getRiskColorClasses(riskData.riskColor)} border-4 rounded-2xl p-8 text-white`}>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{riskData.riskScore}</div>
              <div className="text-2xl font-semibold mb-1">Risk Score</div>
              <div className="text-lg opacity-90">{riskData.riskLevel} Risk Level</div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <div className="bg-white bg-opacity-20 rounded-full px-6 py-2">
                <div className="text-sm font-medium">
                  Safety Rating: {riskData.safetyRating}/100
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          {riskData.riskFactors && riskData.riskFactors.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-red-900">Risk Factors Detected</h3>
              </div>
              <ul className="space-y-2">
                {riskData.riskFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-red-800">
                    <span className="text-red-600 font-bold mt-0.5">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Check className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {riskData.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-blue-800">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
              {/* AI Insights Section */}
{riskData.aiInsights && (
  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4">AI Ingredient Insights</h3>
    <ul className="space-y-2">
      {riskData.aiInsights.map((insight, idx) => (
        <li key={idx} className="border-b pb-2">
          <span className="font-semibold">{insight.name}</span> — 
          <span className="text-sm italic text-gray-700"> {insight.reason}</span>
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
            insight.riskLevel === 'Critical'
              ? 'bg-red-500 text-white'
              : insight.riskLevel === 'High'
              ? 'bg-orange-500 text-white'
              : insight.riskLevel === 'Moderate'
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-green-400 text-gray-900'
          }`}>
            {insight.riskLevel}
          </span>
        </li>
      ))}
    </ul>
  </div>
)}

          {/* Reanalyze Button */}
          <button
            onClick={analyzeRisk}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
          >
            Reanalyze Risk
          </button>
        </div>
      )}
    </div>
    );
};

export default HealthRiskRating;