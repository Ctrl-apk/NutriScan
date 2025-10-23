import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Trash2, Upload, Database, WifiOff, RefreshCw } from 'lucide-react';
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
    const handleOnline = () => {
      setIsOnline(true);
      loadOfflineScans(); // Refresh when coming online
    };
    const handleOffline = () => {
      setIsOnline(false);
      loadOfflineScans(); // Refresh when going offline
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(loadOfflineScans, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
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
      alert('❌ Cannot sync while offline. Please connect to the internet.');
      return;
    }

    setSyncing(true);

    try {
      const unsyncedScans = await offlineStorage.getUnsyncedScans();
      
      if (unsyncedScans.length === 0) {
        alert('✅ All scans are already synced!');
        setSyncing(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const scan of unsyncedScans) {
        try {
          // Upload to server
          const formData = new FormData();
          
          if (scan.imageBlob) {
            // Convert blob to file if needed
            const file = new File([scan.imageBlob], 'scan-image.jpg', { type: 'image/jpeg' });
            formData.append('image', file);
          }
          
          formData.append('extractedText', scan.extractedText);
          formData.append('productName', scan.productName || 'Offline Scanned Product');

          await api.post('/scan/analyze', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          // Mark as synced
          await offlineStorage.markAsSynced(scan.id);
          successCount++;
        } catch (err) {
          console.error(`Failed to sync scan ${scan.id}:`, err);
          failCount++;
        }
      }

      if (successCount > 0) {
        alert(`✅ Successfully synced ${successCount} scan(s)!${failCount > 0 ? ` (${failCount} failed)` : ''}`);
      } else {
        alert(`❌ Failed to sync scans. Please check your connection and try again.`);
      }

      loadOfflineScans();
    } catch (err) {
      alert('❌ Sync failed: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const deleteScan = async (id) => {
    if (!window.confirm('❓ Delete this offline scan?')) return;

    try {
      await offlineStorage.deleteScan(id);
      loadOfflineScans();
    } catch (err) {
      alert('❌ Failed to delete scan');
    }
  };

  const clearAll = async () => {
    if (!window.confirm('⚠️ Delete ALL offline scans? This cannot be undone!')) return;

    try {
      await offlineStorage.clearAll();
      loadOfflineScans();
      alert('✅ All offline scans cleared!');
    } catch (err) {
      alert('❌ Failed to clear scans');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading offline scans...</p>
      </div>
    );
  }

  const unsyncedCount = offlineScans.filter(s => !s.synced).length;
  const syncedCount = offlineScans.length - unsyncedCount;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="w-8 h-8 text-teal-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Offline Scan Cache</h2>
            <p className="text-sm text-gray-600">Auto-updates every 10 seconds</p>
          </div>
        </div>
        
        {/* Real-Time Online/Offline Indicator */}
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-md ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isOnline ? (
            <>
              <Cloud className="w-5 h-5" />
              <span className="font-semibold">Online</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5" />
              <span className="font-semibold">Offline</span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </>
          )}
        </div>
      </div>

      {/* Real-Time Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center border-2 border-gray-200 hover:shadow-md transition">
          <div className="text-4xl font-bold text-gray-800">{offlineScans.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total Cached</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 text-center border-2 border-yellow-200 hover:shadow-md transition">
          <div className="text-4xl font-bold text-yellow-600">{unsyncedCount}</div>
          <div className="text-sm text-gray-600 mt-1">Pending Sync</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border-2 border-green-200 hover:shadow-md transition">
          <div className="text-4xl font-bold text-green-600">{syncedCount}</div>
          <div className="text-sm text-gray-600 mt-1">Synced</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={syncScans}
          disabled={!isOnline || syncing || unsyncedCount === 0}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
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
          onClick={loadOfflineScans}
          className="px-6 py-3 border-2 border-blue-300 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center space-x-2"
          title="Refresh data"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh</span>
        </button>
        
        <button
          onClick={clearAll}
          disabled={offlineScans.length === 0}
          className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
      </div>

      {/* Scans List */}
      {offlineScans.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-semibold">No offline scans cached</p>
          <p className="text-sm text-gray-500 mt-2">
            Scans will be automatically saved here when you're offline
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {offlineScans.map((scan) => (
            <div
              key={scan.id}
              className={`border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${
                scan.synced 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-yellow-200 bg-yellow-50 animate-pulse-slow'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {scan.synced ? (
                      <div className="flex items-center space-x-2">
                        <Cloud className="w-5 h-5 text-green-600" />
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-200 text-green-800">
                          ✓ Synced
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CloudOff className="w-5 h-5 text-yellow-600" />
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-200 text-yellow-800 animate-pulse">
                          ⏳ Pending Sync
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-gray-700">
                      <strong>Product:</strong> {scan.productName || 'Unknown Product'}
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Scanned:</strong> {new Date(scan.timestamp).toLocaleString()}
                    </div>
                    
                    {scan.extractedText && (
                      <div className="text-xs text-gray-600 mt-2 p-2 bg-white rounded border border-gray-200">
                        <strong>Text:</strong> {scan.extractedText.substring(0, 100)}
                        {scan.extractedText.length > 100 && '...'}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteScan(scan.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  title="Delete scan"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Boxes */}
      <div className="mt-6 space-y-3">
        {!isOnline && (
          <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <WifiOff className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <strong>Offline Mode Active:</strong> Your scans are being saved locally and will automatically sync when you're back online.
              </div>
            </div>
          </div>
        )}

        {unsyncedCount > 0 && isOnline && (
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Upload className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Ready to Sync:</strong> You have {unsyncedCount} scan(s) waiting to be uploaded. Click "Sync All" to upload them now.
              </div>
            </div>
          </div>
        )}

        {offlineScans.length > 0 && unsyncedCount === 0 && (
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Cloud className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <strong>All Synced!</strong> All your offline scans have been successfully uploaded to the server.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineScanCache;