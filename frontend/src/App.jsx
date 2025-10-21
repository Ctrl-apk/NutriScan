import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Results from './components/Results';
import History from './components/History';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// App Routes Component
const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      {/* ========== NAVBAR ONLY HERE ========== */}
      {user && <Navbar />}
      {/* ====================================== */}
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <Register />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        
        {/* Default Route */}
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
        
        {/* 404 Route */}
        <Route 
          path="*" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;