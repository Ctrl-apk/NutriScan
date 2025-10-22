import { useState } from 'react';
import { AlertTriangle, X, Flag, Send } from 'lucide-react';
import api from '../utils/api';

const ReportButton = ({ productName, onReportSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    category: 'harmful-ingredient',
    severity: 'medium',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/report', {
        productName,
        ...formData,
      });
      
      alert('✅ Report submitted successfully! Thank you for helping the community.');
      setShowModal(false);
      setFormData({ reason: '', category: 'harmful-ingredient', severity: 'medium' });
      
      if (onReportSuccess) onReportSuccess();
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Failed to submit report'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ========== ENHANCED REPORT BUTTON ========== */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition shadow-lg transform hover:scale-105 font-semibold"
      >
        <Flag className="w-5 h-5" />
        <span>Report Issue</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-slideUp">
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
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Product Name Display */}
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-200">
              <div className="text-sm text-gray-600 mb-1">Reporting Product:</div>
              <div className="font-bold text-gray-800 text-lg">{productName}</div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Issue Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
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
                  {[
                    { value: 'low', label: 'Low', color: 'blue' },
                    { value: 'medium', label: 'Medium', color: 'yellow' },
                    { value: 'high', label: 'High', color: 'orange' },
                    { value: 'critical', label: 'Critical', color: 'red' }
                  ].map((severity) => (
                    <button
                      key={severity.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: severity.value })}
                      className={`px-4 py-3 rounded-xl font-semibold text-sm transition border-2 ${
                        formData.severity === severity.value
                          ? `bg-${severity.color}-500 text-white border-${severity.color}-600 shadow-lg`
                          : `bg-${severity.color}-50 text-${severity.color}-700 border-${severity.color}-200 hover:border-${severity.color}-400`
                      }`}
                    >
                      {severity.label}
                    </button>
                  ))}
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
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.reason.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

      {/* CSS moved to index.css - animations already defined globally */}
    </>
  );
};

export default ReportButton;