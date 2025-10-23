import { useState } from 'react';
import { AlertTriangle, X, Flag, Send, Loader } from 'lucide-react';
import api from '../utils/api';

const ReportButton = ({ productName = 'Unknown Product', onReportSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    reason: '',
    category: 'harmful-ingredient',
    severity: 'medium',
  });

  // Initialize product name when modal opens
  const handleOpenModal = () => {
    setFormData({
      ...formData,
      productName: productName === '[Product Name]' ? '' : productName
    });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.productName.trim()) {
      setError('❌ Product name is required');
      return;
    }

    if (!formData.reason.trim()) {
      setError('❌ Please provide a detailed reason for reporting');
      return;
    }

    if (formData.reason.trim().length < 10) {
      setError('❌ Reason must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      // Add timeout configuration
      const response = await api.post('/report', {
        productName: formData.productName.trim(),
        reason: formData.reason.trim(),
        category: formData.category,
        severity: formData.severity,
      }, {
        timeout: 10000, // 10 seconds timeout
      });

      console.log('Report submitted:', response.data);
      
      // Success!
      setShowModal(false);
      setFormData({ 
        productName: '',
        reason: '', 
        category: 'harmful-ingredient', 
        severity: 'medium' 
      });
      
      // Show success message
      alert('✅ Report submitted successfully! Thank you for helping keep the community safe.');
      
      // Call success callback
      if (onReportSuccess) {
        onReportSuccess();
      }
    } catch (err) {
      console.error('Report submission error:', err);
      
      // Better error messages
      let errorMsg = 'Failed to submit report';
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMsg = 'Request timeout. Please check if the backend server is running on port 5000';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = 'Cannot connect to server. Please ensure backend is running (npm run dev in backend folder)';
      } else if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please login again';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', active: 'bg-blue-500 text-white border-blue-600' },
      medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', active: 'bg-yellow-500 text-white border-yellow-600' },
      high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', active: 'bg-orange-500 text-white border-orange-600' },
      critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', active: 'bg-red-500 text-white border-red-600' }
    };
    return colors[severity] || colors.medium;
  };

  return (
    <>
      {/* ========== REPORT BUTTON ========== */}
      <button
        onClick={handleOpenModal}
        className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition shadow-lg transform hover:scale-105 font-semibold"
      >
        <Flag className="w-5 h-5" />
        <span>Report Issue</span>
      </button>

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-slideUp max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Report Unsafe Product</h3>
                  <p className="text-sm text-gray-600">Help keep the community safe</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="e.g., Coca Cola, Lays Chips, Dairy Milk"
                  disabled={loading}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Issue Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  disabled={loading}
                  required
                >
                  <option value="harmful-ingredient">🔴 Harmful Ingredient</option>
                  <option value="allergen">⚠️ Allergen Not Listed</option>
                  <option value="misleading-label">📋 Misleading Label</option>
                  <option value="expired">📅 Expired Product</option>
                  <option value="other">❓ Other Issue</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Severity Level *
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {['low', 'medium', 'high', 'critical'].map((severity) => {
                    const colors = getSeverityColor(severity);
                    const isActive = formData.severity === severity;
                    
                    return (
                      <button
                        key={severity}
                        type="button"
                        onClick={() => setFormData({ ...formData, severity })}
                        disabled={loading}
                        className={`px-4 py-3 rounded-xl font-semibold text-sm transition border-2 ${
                          isActive
                            ? colors.active
                            : `${colors.bg} ${colors.text} ${colors.border} hover:shadow-md`
                        }`}
                      >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Detailed Reason *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32 resize-none transition"
                  placeholder="Please describe the issue in detail. Include any relevant information that will help others understand the safety concern..."
                  disabled={loading}
                  required
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    Be specific and factual to help others make informed decisions
                  </span>
                  <span className={`text-xs font-semibold ${
                    formData.reason.length > 450 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {formData.reason.length}/500
                  </span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Community Guidelines:</strong> Only report genuine safety concerns. 
                    False reports harm the community and may result in account restrictions.
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.productName.trim() || !formData.reason.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportButton;