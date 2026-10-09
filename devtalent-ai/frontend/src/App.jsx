import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Resumes from './pages/Resumes';
import Jobs from './pages/Jobs';
import SemanticSearch from './pages/SemanticSearch';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resumes" 
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <Dashboard>
                  <Resumes />
                </Dashboard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Dashboard>
                  <Jobs />
                </Dashboard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Dashboard>
                  <SemanticSearch />
                </Dashboard>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
