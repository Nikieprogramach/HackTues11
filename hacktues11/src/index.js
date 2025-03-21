import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import './index.css';
import App from './login';
import AdminPage from './AdminPage';
import UserPage from './UserPage';
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
     <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<App />}/> {/* App.js is the login page */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} ><AdminPage /></ProtectedRoute>} />
            <Route path="/user" element={<ProtectedRoute allowedRoles={["user"]} ><UserPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </AuthProvider>
    </Router>
  </React.StrictMode>
);
