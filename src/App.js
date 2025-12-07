import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './screens/Login';
import Register from './screens/Register';
import ItemList from './screens/ItemList';
import ClaimedItems from './screens/ClaimedItems';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
              <Route path="/" element={<Navigate to="/items" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
