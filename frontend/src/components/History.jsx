import { useState, useEffect } from 'react';
import { Calendar, Trash2, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const History = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/scan/history');
      setScans(data);
    } catch (err) {
      setError('Failed to load scan history',err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scan?')) return;

    try {
      await api.delete(`/scan/${id}`);
      setScans(scans.filter((scan) => scan._id !== id));
    } catch (err) {
      alert('Failed to delete scan',err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Scan History</h1>
          <p className="text-gray-600">View your previous ingredient analyses</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {scans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No scans yet</h3>
            <p className="text-gray-500">Start by scanning your first food label!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(scan.createdAt)}</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      Total ingredients: {scan.results.total}
                    </div>
                    {scan.extractedText && (
                      <p className="text-sm text-gray-500 truncate">
                        {scan.extractedText.substring(0, 100)}...
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-3">
                      <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {scan.results.safe}
                        </div>
                        <div className="text-xs text-gray-600">Safe</div>
                      </div>
                      <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {scan.results.moderate}
                        </div>
                        <div className="text-xs text-gray-600">Moderate</div>
                      </div>
                      <div className="text-center px-4 py-2 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {scan.results.harmful}
                        </div>
                        <div className="text-xs text-gray-600">Harmful</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(scan._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete scan"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;