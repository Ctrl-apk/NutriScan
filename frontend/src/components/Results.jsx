import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, AlertCircle, ArrowLeft, Share2, Flag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ReportButton from './ReportButton';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;
  const productName = location.state?.productName || 'Unknown Product';

  if (!results) {
    navigate('/dashboard');
    return null;
  }

  const chartData = [
    { name: 'Safe', value: results.safe, color: '#10b981' },
    { name: 'Moderate', value: results.moderate, color: '#f59e0b' },
    { name: 'Harmful', value: results.harmful, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Safe':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Harmful':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'Safe':
        return <CheckCircle className="w-4 h-4" />;
      case 'Moderate':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Harmful':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getHealthScore = () => {
    if (results.total === 0) return 0;
    const score = ((results.safe * 100) + (results.moderate * 50)) / results.total;
    return Math.round(score);
  };

  const healthScore = getHealthScore();

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleShare = () => {
    const text = `I analyzed ${results.total} ingredients: ${results.safe} safe, ${results.moderate} moderate, ${results.harmful} harmful. Health Score: ${healthScore}/100`;
    if (navigator.share) {
      navigator.share({
        title: 'NutriScan Results',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header with Report Button */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Analysis Results</h1>
              <p className="text-gray-600">Product: <span className="font-semibold">{productName}</span></p>
              <p className="text-gray-600">Detected {results.total} ingredients</p>
            </div>
            
            {/* ========== PROMINENT REPORT BUTTON ========== */}
            <div className="flex flex-col sm:flex-row gap-3">
              <ReportButton 
                productName={productName}
                onReportSuccess={() => alert('Thank you for reporting!')}
              />
              <button
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
            {/* ============================================== */}
          </div>

          {/* Health Score Badge */}
          <div className="mt-6 inline-block">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md px-8 py-4 border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-1 text-center">Overall Health Score</div>
              <div className={`text-5xl font-bold ${getScoreColor(healthScore)} text-center`}>
                {healthScore}
                <span className="text-2xl">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Chart Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Safety Overview</h2>
            
            {results.total > 0 ? (
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

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200 hover:shadow-md transition">
                    <div className="text-3xl font-bold text-green-600">{results.safe}</div>
                    <div className="text-sm text-gray-600 mt-1">Safe</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200 hover:shadow-md transition">
                    <div className="text-3xl font-bold text-yellow-600">{results.moderate}</div>
                    <div className="text-sm text-gray-600 mt-1">Moderate</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl border-2 border-red-200 hover:shadow-md transition">
                    <div className="text-3xl font-bold text-red-600">{results.harmful}</div>
                    <div className="text-sm text-gray-600 mt-1">Harmful</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No ingredients detected</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingredient Details</h2>
            
            {results.details && results.details.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {results.details.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 ${getRiskColor(
                      item.risk
                    )} transition hover:shadow-md`}
                  >
                    <span className="font-semibold">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(item.risk)}
                      <span className="text-sm font-bold">{item.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No ingredient details available</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 shadow-lg"
          >
            Scan Another Label
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition shadow-lg"
          >
            View History
          </button>
        </div>

        {/* Recommendations */}
        {results.harmful > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-2 text-lg flex items-center space-x-2">
                  <Flag className="w-5 h-5" />
                  <span>Health Alert</span>
                </h3>
                <p className="text-red-800 mb-3">
                  This product contains {results.harmful} harmful ingredient{results.harmful > 1 ? 's' : ''}. 
                  Consider choosing products with fewer harmful additives for better health.
                </p>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-sm text-gray-700 font-medium mb-2">Found an issue with this product?</p>
                  <ReportButton 
                    productName={productName}
                    onReportSuccess={() => alert('Report submitted successfully!')}
                    />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default Results;