import { useState } from 'react';
import { Shield, AlertTriangle, Loader, TrendingDown, Check, X } from 'lucide-react';
import api from '../utils/api';

const HealthRiskAnalysis = ({ scanId, onAnalysisComplete }) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeRisk = async () => {
    if (!scanId) {
      setError('No scan ID provided. Please scan a product first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/ai/risk', { scanId });
      setRiskData(data);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch (err) {
      console.error('Risk analysis error:', err);
      setError(
        err.response?.data?.message || 
        err.message ||
        'Failed to analyze health risk. Please try again.'
      );
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
    return colors[color] || colors.yellow;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-8 h-8 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Health Risk Analysis</h2>
          <p className="text-sm text-gray-600">Powered by Google Gemini AI</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start space-x-3">
          <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
            <p className="text-red-600 text-sm mt-1">
              Make sure you have scanned a product first, then try analyzing again.
            </p>
          </div>
        </div>
      )}

      {!riskData && !loading && (
        <div className="text-center py-12">
          <Shield className="w-20 h-20 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-6">
            {scanId 
              ? 'Get AI-powered personalized health risk analysis for this product'
              : 'Scan a product first to analyze health risks'
            }
          </p>
          <button
            onClick={analyzeRisk}
            disabled={loading || !scanId}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {scanId ? 'Analyze Health Risk' : 'Scan Product First'}
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">AI is analyzing health risks...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 10-15 seconds</p>
        </div>
      )}

      {riskData && !loading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Risk Score Card */}
          <div className={`bg-gradient-to-r ${getRiskColorClasses(riskData.riskColor)} border-4 rounded-2xl p-8 text-white shadow-2xl`}>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{riskData.riskScore}</div>
              <div className="text-2xl font-semibold mb-1">Risk Score</div>
              <div className="text-lg opacity-90 capitalize">{riskData.riskLevel} Risk Level</div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <div className="bg-white bg-opacity-20 rounded-full px-6 py-2 backdrop-blur-sm">
                <div className="text-sm font-medium">
                  Safety Rating: {riskData.safetyRating}/100
                </div>
              </div>
            </div>

            {riskData.cached && (
              <div className="mt-4 text-center text-xs opacity-75">
                📦 Cached result - instant response
              </div>
            )}
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
          {riskData.recommendations && riskData.recommendations.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Check className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-900">AI Recommendations</h3>
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
          )}

          {/* Long Term Effects */}
          {riskData.longTermEffects && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-3">Long-Term Health Impact</h3>
              <p className="text-purple-800">{riskData.longTermEffects}</p>
            </div>
          )}

          {/* Reanalyze Button */}
          <div className="flex space-x-3">
            <button
              onClick={analyzeRisk}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              Reanalyze Risk
            </button>
            {onAnalysisComplete && (
              <button
                onClick={() => setRiskData(null)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* AI Provider Badge */}
          <div className="text-center">
            <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 rounded-full text-sm font-semibold text-indigo-800">
              <span>🤖</span>
              <span>Analyzed by {riskData.aiProvider || 'Gemini AI'}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRiskAnalysis;