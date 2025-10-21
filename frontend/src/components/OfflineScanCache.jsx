import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Trash2, Upload, Database, WifiOff } from 'lucide-react';
import { offlineStorage } from '../utils/offlineStorage';
import api from '../utils/api';

const OfflineScanCache = () => {
  const [offlineScans, setOfflineScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    loadOfflineScans();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineScans = async () => {
    try {
      const scans = await offlineStorage.getAllScans();
      setOfflineScans(scans);
    } catch (err) {
      console.error('Load offline scans error:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncScans = async () => {
    if (!isOnline) {
      alert('Cannot sync while offline');
      return;
    }

    setSyncing(true);

    try {
      const unsyncedScans = await offlineStorage.getUnsyncedScans();
      
      for (const scan of unsyncedScans) {
        try {
          // Upload to server
          const formData = new FormData();
          if (scan.imageBlob) {
            formData.append('image', scan.imageBlob);
          }
          formData.append('extractedText', scan.extractedText);

          await api.post('/scan/analyze', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          // Mark as synced
          await offlineStorage.markAsSynced(scan.id);
        } catch (err) {
          console.error(`Failed to sync scan ${scan.id}:`, err);
        }
      }

      alert('All scans synced successfully!');
      loadOfflineScans();
    } catch (err) {
      alert('Failed to sync some scans');
    } finally {
      setSyncing(false);
    }
  };

  const deleteScan = async (id) => {
    if (!window.confirm('Delete this offline scan?')) return;

    try {
      await offlineStorage.deleteScan(id);
      loadOfflineScans();
    } catch (err) {
      alert('Failed to delete scan');
    }
  };

  const clearAll = async () => {
    if (!window.confirm('Delete all offline scans?')) return;

    try {
      await offlineStorage.clearAll();
      loadOfflineScans();
    } catch (err) {
      alert('Failed to clear scans');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading offline scans...</p>
      </div>
    );
  }

  const unsyncedCount = offlineScans.filter(s => !s.synced).length;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="w-8 h-8 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">Offline Scan Cache</h2>
        </div>
        
        {/* Online/Offline Indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isOnline ? (
            <>
              <Cloud className="w-4 h-4" />
              <span className="text-sm font-semibold">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-semibold">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200">
          <div className="text-3xl font-bold text-gray-800">{offlineScans.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total Cached</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center border-2 border-yellow-200">
          <div className="text-3xl font-bold text-yellow-600">{unsyncedCount}</div>
          <div className="text-sm text-gray-600 mt-1">Unsynced</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
          <div className="text-3xl font-bold text-green-600">
            {offlineScans.length - unsyncedCount}
          </div>
          <div className="text-sm text-gray-600 mt-1">Synced</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={syncScans}
          disabled={!isOnline || syncing || unsyncedCount === 0}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {syncing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Sync All ({unsyncedCount})</span>
            </>
          )}
        </button>
        <button
          onClick={clearAll}
          disabled={offlineScans.length === 0}
          className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
      </div>

      {/* Scans List */}
      {offlineScans.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No offline scans cached</p>
          <p className="text-sm text-gray-500 mt-2">
            Scans will be automatically saved here when you're offline
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {offlineScans.map((scan) => (
            <div
              key={scan.id}
              className={`border-2 rounded-lg p-4 ${
                scan.synced ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {scan.synced ? (
                      <Cloud className="w-5 h-5 text-green-600" />
                    ) : (
                      <CloudOff className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      scan.synced ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {scan.synced ? 'Synced' : 'Pending Sync'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-1">
                    <strong>Scanned:</strong> {new Date(scan.timestamp).toLocaleString()}
                  </div>
                  
                  {scan.extractedText && (
                    <div className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {scan.extractedText.substring(0, 100)}...
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteScan(scan.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  title="Delete scan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {!isOnline && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <WifiOff className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <strong>Offline Mode Active:</strong> Your scans are being saved locally and will automatically sync when you're back online.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineScanCache;