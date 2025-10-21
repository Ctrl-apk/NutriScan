import { useState, useEffect } from 'react';
import { AlertTriangle, ThumbsUp, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';

const ReportsList = ({ showMyReports = false }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, [showMyReports, filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const endpoint = showMyReports ? '/report/my-reports' : '/report';
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await api.get(`${endpoint}${params}`);
      setReports(data.reports);
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await api.put(`/report/${id}/upvote`);
      fetchReports(); // Refresh list
    } catch (err) {
      alert('Failed to upvote report',err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await api.delete(`/report/${id}`);
      setReports(reports.filter(r => r._id !== id));
    } catch (err) {
      alert('Failed to delete report',err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewing': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'dismissed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {showMyReports ? 'My Reports' : 'Community Reports'}
          </h2>
        </div>
        <div className="text-sm text-gray-600">
          {reports.length} report{reports.length !== 1 && 's'}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['all', 'pending', 'reviewing', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filter === status
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No reports found</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {reports.map((report) => (
            <div
              key={report._id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-bold text-gray-800">{report.productName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    {getStatusIcon(report.status)}
                    <span className="capitalize">{report.status}</span>
                    <span>•</span>
                    <span className="capitalize">{report.category.replace('-', ' ')}</span>
                    <span>•</span>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{report.reason}</p>
                  {report.reportedByEmail && !showMyReports && (
                    <p className="text-xs text-gray-500 mt-2">
                      Reported by: {report.reportedByEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleUpvote(report._id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{report.upvotes || 0}</span>
                </button>
                
                {showMyReports && (
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsList;