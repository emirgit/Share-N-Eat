import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import ChangeUsername from './pages/ChangeUsername';
import ChangePassword from './pages/ChangePassword';
import ChangePhoto from './pages/ChangePhoto'; // Corrected the import
import ChangeDescription from './pages/ChangeDescription';
import HelpPage from './pages/HelpPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import PrivateRoute from './components/PrivateRoute'; // Make sure the path is correct
import ProductPage from './pages/ProductPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot/password" element={<PrivateRoute element={ForgotPassword} />} />
        <Route path="/auth/reset/password" element={<PrivateRoute element={ResetPassword} />} />
        <Route path="/auth/verify/account" element={<PrivateRoute element={ResetPassword} />} />


        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute element={MainPage} />} />
        <Route path="/upload" element={<PrivateRoute element={UploadPage} />} />
        <Route path="/profile" element={<PrivateRoute element={ProfilePage} />} />
        <Route path="/change-username" element={<PrivateRoute element={ChangeUsername} />} />
        <Route path="/change-password" element={<PrivateRoute element={ChangePassword} />} />
        <Route path="/change-photo" element={<PrivateRoute element={ChangePhoto} />} />
        <Route path="/change-description" element={<PrivateRoute element={ChangeDescription} />} />
        <Route path="/help" element={<PrivateRoute element={HelpPage} />} />
        

      </Routes>
    </Router>
  );
}

export default App;
