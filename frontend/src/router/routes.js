import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../components/LoginPage/LoginPage';
import Dashboard from '../components/Dashboard/Dashboard';
import ProfilePage from '../components/ProfilePage/ProfilePage';

const RoutesComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
