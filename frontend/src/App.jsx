import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SkillMatchLanding from './pages/SkillMatchLanding';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HRDashboard from './features/hr/pages/HRDashboard';
import HRPipeline from './features/hr/pages/HRPipeline';
import CreateJobPost from './features/hr/pages/CreateJobPost';
import ManageJob from './features/hr/pages/ManageJob';
import StudentDashboard from './features/student/pages/StudentDashboard';
import JobDiscovery from './features/student/pages/JobDiscovery';
import Profile from './pages/Profile';
function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsAuthChecking(false);
  }, []);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      {user && <Navbar user={user} setUser={setUser} />}

      <Routes>
        <Route path="/" element={<SkillMatchLanding />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
              <p className="text-lg text-gray-600">You do not have permission to view this page.</p>
            </div>
          </div>
        } />

        <Route path="/hr" element={
          <ProtectedRoute user={user} allowedRole="hr">
            <HRDashboard user={user} />
          </ProtectedRoute>
        } />
        <Route path="/hr/job/:jobId" element={
          <ProtectedRoute user={user} allowedRole="hr">
            <ManageJob />
          </ProtectedRoute>
        } />
        <Route path="/hr/pipeline" element={
          <ProtectedRoute user={user} allowedRole="hr">
            <HRPipeline />
          </ProtectedRoute>
        } />
        <Route path="/hr/create-job" element={
          <ProtectedRoute user={user} allowedRole="hr">
            <CreateJobPost />
          </ProtectedRoute>
        } />

        <Route path="/student" element={
          <ProtectedRoute user={user} allowedRole="student">
            <StudentDashboard user={user} />
          </ProtectedRoute>
        } />
        <Route path="/student/discover" element={
          <ProtectedRoute user={user} allowedRole="student">
            <JobDiscovery user={user} />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
  <ProtectedRoute user={user} allowedRole={user?.role}>
    <Profile user={user} />
  </ProtectedRoute>
} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;