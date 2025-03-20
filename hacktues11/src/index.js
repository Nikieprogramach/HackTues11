import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import './index.css';
import App from './App';
import AdminPage from './AdminPage';
import UserPage from './UserPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('App is rendering!');
root.render(
  <React.StrictMode>
     <Router>
      <Routes>
        <Route path="/" element={<App />} /> {/* App.js is the login page */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Router>
  </React.StrictMode>
);
