import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Home, Camera, User, TrendingUp, Lightbulb, Smile, 
  Shield, Bell, Database, MessageCircle, FileText, Menu, X 
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

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [healthProfile, setHealthProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nutritionData] = useState({
    carbs: 45,
    protein: 25,
    fat: 30,
  });

  useEffect(() => {
    fetchHealthProfile();
  }, []);

  const fetchHealthProfile = async () => {
    try {
      const { data } = await api.get(`/profile/${user.email}`);
      setHealthProfile(data.healthProfile);
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  };

  // Navigation items with beautiful icons and colors
  const navItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Home, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    { 
      id: 'scan', 
      label: 'Scan Food', 
      icon: Camera, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      badge: 'Popular'
    },
    { 
      id: 'profile', 
      label: 'Health Profile', 
      icon: User, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    { 
      id: 'nutrition', 
      label: 'Nutrition Tracker', 
      icon: TrendingUp, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    },
    { 
      id: 'ai-tools', 
      label: 'AI Tools', 
      icon: Lightbulb, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      hoverColor: 'hover:bg-yellow-100',
      badge: 'New',
      isCategory: true
    },
    { 
      id: 'substitution', 
      label: 'Smart Substitution', 
      icon: Lightbulb, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      hoverColor: 'hover:bg-yellow-100',
      indent: true
    },
    { 
      id: 'mood', 
      label: 'Mood Foods', 
      icon: Smile, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      hoverColor: 'hover:bg-pink-100',
      indent: true
    },
    { 
      id: 'risk', 
      label: 'Health Risk Rating', 
      icon: Shield, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      indent: true
    },
    { 
      id: 'chat', 
      label: 'Ask AI Expert', 
      icon: MessageCircle, 
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      hoverColor: 'hover:bg-cyan-100',
      indent: true,
      badge: 'AI'
    },
    { 
      id: 'community', 
      label: 'Community', 
      icon: Bell, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
      isCategory: true
    },
    { 
      id: 'alerts', 
      label: 'Product Alerts', 
      icon: Bell, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
      indent: true
    },
    { 
      id: 'reports', 
      label: 'Reports & Reviews', 
      icon: FileText, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      hoverColor: 'hover:bg-gray-100',
      indent: true
    },
    { 
      id: 'offline', 
      label: 'Offline Cache', 
      icon: Database, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      hoverColor: 'hover:bg-teal-100'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="flex relative">
        {/* ========== SIDEBAR NAVIGATION ========== */}
        <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-2xl transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-72' : 'w-0'
        } overflow-hidden`}>
          <div className="p-6 h-full overflow-y-auto">
            {/* User Welcome Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg">Hello, {user.name}!</h3>
                  <p className="text-green-100 text-sm">Welcome back 👋</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                
                if (item.isCategory) {
                  return (
                    <div key={item.id} className="pt-6 pb-2">
                      <div className="flex items-center space-x-2 px-3">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                      item.indent ? 'ml-6' : ''
                    } ${
                      activeTab === item.id
                        ? `${item.bgColor} ${item.color} shadow-md scale-105`
                        : `text-gray-700 ${item.hoverColor}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${activeTab === item.id ? item.color : 'text-gray-400 group-hover:' + item.color}`} />
                      <span className={`font-medium text-sm ${activeTab === item.id ? 'font-bold' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.badge && activeTab !== item.id && (
                      <span className={`px-2 py-0.5 ${item.bgColor} ${item.color} text-xs font-bold rounded-full`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats at Bottom */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-xs text-gray-600">Scans</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-xs text-gray-600">Items</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT AREA ========== */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-72' : 'ml-0'
        } p-8`}>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'overview' && 'Your personalized health dashboard'}
              {activeTab === 'scan' && 'Scan food labels instantly with AI-powered OCR'}
              {activeTab === 'profile' && 'Manage your health preferences and goals'}
              {activeTab === 'nutrition' && 'Track your daily macros and calories'}
              {activeTab === 'substitution' && 'Find healthier alternatives to harmful ingredients'}
              {activeTab === 'mood' && 'Get food recommendations based on your mood'}
              {activeTab === 'risk' && 'AI-powered health risk analysis for scanned products'}
              {activeTab === 'chat' && 'Ask our AI expert about any ingredient'}
              {activeTab === 'alerts' && 'Community-reported unsafe products'}
              {activeTab === 'reports' && 'View and manage product reports'}
              {activeTab === 'offline' && 'Access your scans offline'}
            </p>
          </div>

          {/* ========== CONTENT SECTIONS ========== */}
          
          {/* OVERVIEW TAB - Dashboard with Cards */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Top Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Scans</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">24</p>
                      <p className="text-green-600 text-xs mt-1">↑ 12% this week</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-full">
                      <Camera className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Safe Ingredients</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">142</p>
                      <p className="text-green-600 text-xs mt-1">91% safety rate</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-full">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Warnings</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
                      <p className="text-yellow-600 text-xs mt-1">Monitor closely</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-full">
                      <Bell className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Health Score</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">85/100</p>
                      <p className="text-purple-600 text-xs mt-1">Great!</p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-full">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Health Profile */}
                <div className="lg:col-span-1">
                  <HealthProfileCard profile={healthProfile} />
                </div>

                {/* Right Column - Charts and Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                  <NutritionChart data={nutritionData} type="pie" />

                  {/* Quick Action Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setActiveTab('scan')}
                      className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition text-left group"
                    >
                      <Camera className="w-12 h-12 mb-4 group-hover:scale-110 transition" />
                      <h3 className="text-xl font-bold mb-2">Scan New Product</h3>
                      <p className="text-green-100 text-sm">Upload a food label and get instant analysis</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('chat')}
                      className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition text-left group"
                    >
                      <MessageCircle className="w-12 h-12 mb-4 group-hover:scale-110 transition" />
                      <h3 className="text-xl font-bold mb-2">Ask AI Expert</h3>
                      <p className="text-purple-100 text-sm">Get instant answers about any ingredient</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('substitution')}
                      className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition text-left group"
                    >
                      <Lightbulb className="w-12 h-12 mb-4 group-hover:scale-110 transition" />
                      <h3 className="text-xl font-bold mb-2">Smart Substitutes</h3>
                      <p className="text-yellow-100 text-sm">Find healthier alternatives to harmful ingredients</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('mood')}
                      className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition text-left group"
                    >
                      <Smile className="w-12 h-12 mb-4 group-hover:scale-110 transition" />
                      <h3 className="text-xl font-bold mb-2">Mood Foods</h3>
                      <p className="text-pink-100 text-sm">Food recommendations based on your mood</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {[
                    { action: 'Scanned Coca Cola', time: '2 hours ago', status: 'warning' },
                    { action: 'Added meal to nutrition tracker', time: '5 hours ago', status: 'success' },
                    { action: 'Reported unsafe product', time: '1 day ago', status: 'info' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'warning' ? 'bg-yellow-500' :
                          activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-gray-800 font-medium">{activity.action}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCAN TAB */}
          {activeTab === 'scan' && (
            <div className="max-w-4xl mx-auto">
              <ScanUpload />
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto">
              <ProfileForm />
            </div>
          )}

          {/* NUTRITION TRACKER TAB */}
          {activeTab === 'nutrition' && (
            <div className="max-w-5xl mx-auto">
              <DailyNutritionTracker />
            </div>
          )}

          {/* AI SUBSTITUTION TAB */}
          {activeTab === 'substitution' && (
            <div className="max-w-4xl mx-auto">
              <AISubstitution />
            </div>
          )}

          {/* MOOD FOODS TAB */}
          {activeTab === 'mood' && (
            <div className="max-w-4xl mx-auto">
              <MoodBasedRecommendation />
            </div>
          )}

          {/* HEALTH RISK RATING TAB */}
          {activeTab === 'risk' && (
            <div className="max-w-4xl mx-auto">
              <HealthRiskRating scanId={null} />
            </div>
          )}

          {/* ASK AI EXPERT TAB */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto">
              <IngredientChat />
            </div>
          )}

          {/* COMMUNITY ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div className="max-w-6xl mx-auto">
              <CommunityAlerts />
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">My Reports</h3>
                <ReportList showMyReports={true} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Community Reports</h3>
                <ReportList showMyReports={false} />
              </div>
            </div>
          )}

          {/* OFFLINE CACHE TAB */}
          {activeTab === 'offline' && (
            <div className="max-w-4xl mx-auto">
              <OfflineScanCache />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;