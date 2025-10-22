import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { offlineStorage } from '../utils/offlineStorage';
import { 
  Home, Camera, User, TrendingUp, Lightbulb, Smile, 
  Shield, Bell, Database, MessageCircle, FileText, Menu, X, Flag,
  Activity, Zap
} from 'lucide-react';

// Import all components
import ProfileForm from '../components/ProfileForm';
import NutritionChart from '../components/NutritionChart';
import ReportList from '../components/ReportList';
import HealthProfileCard from '../components/HealthProfileCard';
import ScanUpload from '../components/ScanUpload';
import AISubstitution from '../components/AISubstitution';
import MoodBasedRecommendation from '../components/MoodBasedRecommendation';
import DailyNutritionTracker from '../components/DailyNutritionTracker';
import HealthRiskRating from '../components/HealthRiskRating';
import CommunityAlerts from '../components/CommunityAlerts';
import OfflineScanCache from '../components/OfflineScanCache';
import IngredientChat from '../components/IngredientChat';
import ReportButton from '../components/ReportButton';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [healthProfile, setHealthProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Real-time stats
  const [stats, setStats] = useState({
    totalScans: 0,
    safeIngredients: 0,
    warnings: 0,
    healthScore: 0,
    offlineScans: 0,
    recentActivity: []
  });
  
  const [nutritionData] = useState({
    carbs: 45,
    protein: 25,
    fat: 30,
  });

  // Fetch all data on mount
  useEffect(() => {
    fetchHealthProfile();
    fetchRealTimeStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchRealTimeStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealthProfile = async () => {
    try {
      const { data } = await api.get(`/profile/${user.email}`);
      setHealthProfile(data.healthProfile);
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      // Fetch scan history
      const { data: scans } = await api.get('/scan/history');
      
      // Fetch offline scans
      const offlineScans = await offlineStorage.getAllScans();
      
      // Calculate stats
      const totalScans = scans.length + offlineScans.length;
      let safeCount = 0;
      let warningCount = 0;
      
      scans.forEach(scan => {
        safeCount += scan.results.safe || 0;
        warningCount += (scan.results.moderate || 0) + (scan.results.harmful || 0);
      });
      
      // Calculate health score
      const totalIngredients = safeCount + warningCount;
      const healthScore = totalIngredients > 0 
        ? Math.round((safeCount / totalIngredients) * 100) 
        : 0;
      
      // Recent activity (last 5 scans)
      const recentActivity = scans.slice(0, 5).map(scan => ({
        action: `Scanned ${scan.productName || 'Product'}`,
        time: new Date(scan.createdAt).toLocaleString(),
        status: scan.results.harmful > 0 ? 'warning' : 
                scan.results.moderate > 0 ? 'moderate' : 'success',
        details: `${scan.results.safe} safe, ${scan.results.harmful} harmful`
      }));
      
      setStats({
        totalScans,
        safeIngredients: safeCount,
        warnings: warningCount,
        healthScore,
        offlineScans: offlineScans.length,
        recentActivity
      });
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  // Navigation items
  const navItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Home, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500'
    },
    { 
      id: 'scan', 
      label: 'Scan Food', 
      icon: Camera, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      badge: 'Popular',
      badgeColor: 'bg-green-500'
    },
    { 
      id: 'profile', 
      label: 'Health Profile', 
      icon: User, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500'
    },
    { 
      id: 'nutrition', 
      label: 'Nutrition Tracker', 
      icon: TrendingUp, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500'
    },
    { 
      id: 'divider-ai',
      isDivider: true,
      label: 'AI TOOLS'
    },
    { 
      id: 'substitution', 
      label: 'Smart Substitution', 
      icon: Lightbulb, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500'
    },
    { 
      id: 'mood', 
      label: 'Mood Foods', 
      icon: Smile, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-500'
    },
    { 
      id: 'risk', 
      label: 'Health Risk Rating', 
      icon: Shield, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-500'
    },
    { 
      id: 'chat', 
      label: 'Ask AI Expert', 
      icon: MessageCircle, 
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-500',
      badge: 'AI',
      badgeColor: 'bg-cyan-500'
    },
    { 
      id: 'divider-community',
      isDivider: true,
      label: 'COMMUNITY'
    },
    { 
      id: 'alerts', 
      label: 'Product Alerts', 
      icon: Bell, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500'
    },
    { 
      id: 'report-product', 
      label: 'Report Product', 
      icon: Flag, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      badge: 'New',
      badgeColor: 'bg-orange-500'
    },
    { 
      id: 'reports', 
      label: 'My Reports', 
      icon: FileText, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-500'
    },
    { 
      id: 'divider-offline',
      isDivider: true,
      label: 'OFFLINE'
    },
    { 
      id: 'offline', 
      label: 'Offline Cache', 
      icon: Database, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-500',
      badge: stats.offlineScans > 0 ? stats.offlineScans.toString() : null,
      badgeColor: 'bg-teal-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="flex relative">
        {/* ========== PERFECTLY ALIGNED SIDEBAR ========== */}
        <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50 border-r-2 border-gray-200 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-80' : 'w-0'
        } overflow-hidden shadow-2xl`}>
          <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* User Welcome Card - Matches Navbar */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl border-2 border-green-500">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm border-2 border-white border-opacity-50">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-1">Hello, {user.name}!</h3>
                  <p className="text-green-100 text-sm flex items-center space-x-1">
                    <Activity className="w-4 h-4" />
                    <span>Welcome back</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                if (item.isDivider) {
                  return (
                    <div key={item.id} className="pt-4 pb-2">
                      <div className="flex items-center space-x-2 px-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {item.label}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                      </div>
                    </div>
                  );
                }

                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      isActive
                        ? `${item.bgColor} shadow-lg scale-[1.02] border-l-4 ${item.borderColor}`
                        : 'hover:bg-gray-100 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? `${item.bgColor} ring-2 ring-opacity-50 ring-offset-1` 
                            : 'group-hover:bg-gray-200'
                        }`}>
                          <Icon className={`w-5 h-5 transition-all duration-300 ${
                            isActive ? item.color : 'text-gray-500 group-hover:text-gray-700'
                          }`} />
                        </div>
                        <span className={`font-medium text-sm transition-all duration-300 ${
                          isActive ? `${item.color} font-bold` : 'text-gray-700'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      {item.badge && (
                        <span className={`px-3 py-1 ${item.badgeColor || 'bg-gray-500'} text-white text-xs font-bold rounded-full shadow-sm`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    
                    {/* Animated Background on Hover */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Live Stats Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Live Stats</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalScans}</div>
                  <div className="text-xs text-gray-600 mt-1">Total Scans</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
                  <div className="text-2xl font-bold text-green-600">{stats.safeIngredients}</div>
                  <div className="text-xs text-gray-600 mt-1">Safe Items</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600">{stats.warnings}</div>
                  <div className="text-xs text-gray-600 mt-1">Warnings</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">{stats.healthScore}</div>
                  <div className="text-xs text-gray-600 mt-1">Health %</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT AREA ========== */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-80' : 'ml-0'
        } min-h-screen`}>
          {/* ========== PERFECTLY ALIGNED TOGGLE BUTTON ========== */}
          <div className="sticky top-16 z-50 bg-gradient-to-b from-white to-transparent pb-4 pt-6 px-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-green-500 flex items-center justify-center"
              title={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="px-8 pb-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600 text-lg">
                {activeTab === 'overview' && '📊 Your personalized health dashboard with real-time insights'}
                {activeTab === 'scan' && '📸 Scan food labels instantly with AI-powered OCR'}
                {activeTab === 'profile' && '👤 Manage your health preferences and goals'}
                {activeTab === 'nutrition' && '🍽️ Track your daily macros and calories'}
                {activeTab === 'substitution' && '💡 Find healthier alternatives to harmful ingredients'}
                {activeTab === 'mood' && '😊 Get food recommendations based on your mood'}
                {activeTab === 'risk' && '🛡️ AI-powered health risk analysis for scanned products'}
                {activeTab === 'chat' && '💬 Ask our AI expert about any ingredient'}
                {activeTab === 'alerts' && '🚨 Community-reported unsafe products'}
                {activeTab === 'report-product' && '🚩 Report unsafe or misleading products'}
                {activeTab === 'reports' && '📋 View and manage your product reports'}
                {activeTab === 'offline' && '💾 Access your scans offline anytime'}
              </p>
            </div>

            {/* ========== CONTENT SECTIONS ========== */}
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Real-Time Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-500 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Total Scans</p>
                        <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalScans}</p>
                        <p className="text-green-600 text-xs mt-1 flex items-center space-x-1">
                          <Activity className="w-3 h-3" />
                          <span>Live Updated</span>
                        </p>
                      </div>
                      <div className="bg-blue-100 p-4 rounded-full">
                        <Camera className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-green-500 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Safe Ingredients</p>
                        <p className="text-4xl font-bold text-gray-800 mt-2">{stats.safeIngredients}</p>
                        <p className="text-green-600 text-xs mt-1">
                          {stats.safeIngredients + stats.warnings > 0 
                            ? `${Math.round((stats.safeIngredients / (stats.safeIngredients + stats.warnings)) * 100)}% safety rate`
                            : 'No data yet'}
                        </p>
                      </div>
                      <div className="bg-green-100 p-4 rounded-full">
                        <Shield className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-yellow-500 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Warnings</p>
                        <p className="text-4xl font-bold text-gray-800 mt-2">{stats.warnings}</p>
                        <p className="text-yellow-600 text-xs mt-1">Monitor closely</p>
                      </div>
                      <div className="bg-yellow-100 p-4 rounded-full">
                        <Bell className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-500 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Health Score</p>
                        <p className="text-4xl font-bold text-gray-800 mt-2">{stats.healthScore}/100</p>
                        <p className="text-purple-600 text-xs mt-1">
                          {stats.healthScore >= 80 ? 'Excellent!' : 
                           stats.healthScore >= 60 ? 'Good!' : 
                           stats.healthScore >= 40 ? 'Fair' : 'Needs Improvement'}
                        </p>
                      </div>
                      <div className="bg-purple-100 p-4 rounded-full">
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <HealthProfileCard profile={healthProfile} />
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <NutritionChart data={nutritionData} type="pie" />

                    <div className="grid md:grid-cols-2 gap-6">
                      <button
                        onClick={() => setActiveTab('scan')}
                        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left group"
                      >
                        <Camera className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-bold mb-2">Scan New Product</h3>
                        <p className="text-green-100 text-sm">Upload a food label and get instant analysis</p>
                      </button>

                      <button
                        onClick={() => setActiveTab('chat')}
                        className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left group"
                      >
                        <MessageCircle className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-bold mb-2">Ask AI Expert</h3>
                        <p className="text-purple-100 text-sm">Get instant answers about any ingredient</p>
                      </button>

                      <button
                        onClick={() => setActiveTab('substitution')}
                        className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left group"
                      >
                        <Lightbulb className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-bold mb-2">Smart Substitutes</h3>
                        <p className="text-yellow-100 text-sm">Find healthier alternatives to harmful ingredients</p>
                      </button>

                      <button
                        onClick={() => setActiveTab('mood')}
                        className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left group"
                      >
                        <Smile className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-bold mb-2">Mood Foods</h3>
                        <p className="text-pink-100 text-sm">Food recommendations based on your mood</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Real-Time Recent Activity */}
                {stats.recentActivity.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                        <Activity className="w-6 h-6 text-green-600" />
                        <span>Recent Activity</span>
                      </h2>
                      <span className="text-sm text-gray-500 flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>Live</span>
                      </span>
                    </div>
                    <div className="space-y-3">
                      {stats.recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-300 border-l-4 border-transparent hover:border-green-500">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`w-3 h-3 rounded-full mt-1.5 ${
                              activity.status === 'warning' ? 'bg-yellow-500' :
                              activity.status === 'moderate' ? 'bg-orange-500' :
                              'bg-green-500'
                            } animate-pulse`}></div>
                            <div className="flex-1">
                              <span className="text-gray-800 font-semibold">{activity.action}</span>
                              <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                            </div>
                          </div>
                          <span className="text-gray-500 text-xs whitespace-nowrap ml-4">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ALL OTHER TABS */}
            {activeTab === 'scan' && (
              <div className="max-w-4xl mx-auto">
                <ScanUpload />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-4xl mx-auto">
                <ProfileForm />
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="max-w-5xl mx-auto">
                <DailyNutritionTracker />
              </div>
            )}

            {activeTab === 'substitution' && (
              <div className="max-w-4xl mx-auto">
                <AISubstitution />
              </div>
            )}

            {activeTab === 'mood' && (
              <div className="max-w-4xl mx-auto">
                <MoodBasedRecommendation />
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="max-w-4xl mx-auto">
                <HealthRiskRating scanId={null} />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="max-w-4xl mx-auto">
                <IngredientChat />
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="max-w-6xl mx-auto">
                <CommunityAlerts />
              </div>
            )}

            {activeTab === 'report-product' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Flag className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Report Unsafe Product</h2>
                      <p className="text-sm text-gray-600">Help keep the community safe</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-red-900 mb-2">📢 Community Guidelines</h3>
                    <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
                      <li>Please provide accurate and honest information.</li>
                      <li>Avoid submitting duplicate reports for the same product.</li>
                      <li>Respect privacy and do not share personal data.</li>
                      <li>Use respectful language; offensive content will be removed.</li>
                      <li>Reports are reviewed by our moderation team before action is taken.</li>
                    </ul>
                  </div>

                  <ReportButton productName="Sample Product Name" onReportSuccess={() => setActiveTab('reports')} />
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="max-w-6xl mx-auto">
                <ReportList />
              </div>
            )}

            {activeTab === 'offline' && (
              <div className="max-w-4xl mx-auto">
                <OfflineScanCache />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;