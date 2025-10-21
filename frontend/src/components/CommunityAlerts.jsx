import { useState, useEffect } from 'react';
import { Bell, AlertCircle, TrendingUp, Clock, Filter } from 'lucide-react';
import api from '../utils/api';

const CommunityAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?severity=${filter}` : '';
      const { data } = await api.get(`/report${params}`);
      
      // Get top reported products
      const sortedAlerts = data.reports
        .filter(report => report.upvotes > 5) // Only show highly upvoted
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 10);
      
      setAlerts(sortedAlerts);
    } catch (err) {
      console.error('Fetch alerts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      low: 'bg-blue-100 text-blue-800 border-blue-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      critical: 'bg-red-100 text-red-800 border-red-300',
    };
    return badges[severity] || badges.medium;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'allergen':
        return '🚨';
      case 'harmful-ingredient':
        return '☠️';
      case 'misleading-label':
        return '⚠️';
      case 'expired':
        return '📅';
      default:
        return '❗';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading community alerts...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-8 h-8 text-red-600 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800">Community Product Alerts</h2>
        </div>
        {alerts.length > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
            {alerts.length} Active Alerts
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
        <Filter className="w-4 h-4 text-gray-600 flex-shrink-0" />
        {['all', 'critical', 'high', 'medium'].map((severityFilter) => (
          <button
            key={severityFilter}
            onClick={() => setFilter(severityFilter)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition whitespace-nowrap ${
              filter === severityFilter
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {severityFilter.charAt(0).toUpperCase() + severityFilter.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No community alerts at this time</p>
          <p className="text-sm text-gray-500 mt-2">Products reported by users will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className="border-2 border-red-200 bg-red-50 rounded-xl p-5 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-3xl">{getCategoryIcon(alert.category)}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {alert.productName}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600 capitalize">
                        {alert.category.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{alert.reason}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-semibold">{alert.upvotes} upvotes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Banner */}
              {alert.severity === 'critical' && (
                <div className="mt-3 p-3 bg-red-600 text-white rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    ⚠️ CRITICAL: Avoid this product - Multiple community reports
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Community-Powered Safety:</strong> These alerts are based on reports from users like you. Products with high upvotes indicate widespread concerns.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityAlerts;