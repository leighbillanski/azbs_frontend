import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import InactivityWarning from './components/InactivityWarning';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import ItemList from './screens/ItemList';
import ClaimedItems from './screens/ClaimedItems';
import BankingDetails from './screens/BankingDetails';
import EventDetails from './screens/EventDetails';
import Profile from './screens/Profile';
import RSVP from './screens/RSVP';
import HowToUse from './screens/HowToUse';
import AdminTools from './screens/AdminTools';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <InactivityWarning />
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items"
                element={
                  <ProtectedRoute>
                    <ItemList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/claimed"
                element={
                  <ProtectedRoute>
                    <ClaimedItems />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/banking"
                element={
                  <ProtectedRoute>
                    <BankingDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/event"
                element={
                  <ProtectedRoute>
                    <EventDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rsvp"
                element={
                  <ProtectedRoute>
                    <RSVP />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/how-to-use"
                element={
                  <ProtectedRoute>
                    <HowToUse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminTools />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
