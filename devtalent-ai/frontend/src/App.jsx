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
import CapabilityProfile from './pages/CapabilityProfile';
import Candidates from './pages/Candidates';
import Assessments from './pages/Assessments';
import CreateAssessment from './pages/CreateAssessment';
import Analytics from './pages/Analytics';
import TeamBuilder from './pages/TeamBuilder';

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
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <Dashboard>
                  <CapabilityProfile />
                </Dashboard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assessments" 
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <Dashboard>
                  <Assessments />
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
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Dashboard>
                  <Analytics />
                </Dashboard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/team-builder" 
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Dashboard>
                  <TeamBuilder />
                </Dashboard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-assessment" 
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Dashboard>
                  <CreateAssessment />
                </Dashboard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/candidates" 
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Dashboard>
                  <Candidates />
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
