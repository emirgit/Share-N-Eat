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
import ProductPage from './pages/ProductPage'
import PostPage from './pages/PostPage';

import PrivateRoute from './components/PrivateRoute'; // Make sure the path is correct
import AdminPanel from './pages/AdminPanel';
import PostManagement from './pages/PostManagement';
import Support from './pages/Support';
import SiteSettings from './pages/SiteSettings';
import ProductManagement from './pages/ProductManagement';
import UserManagement from './pages/UserManagement';
import SettingsPage from './pages/SettingsPage';

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
        <Route path="/profile" element={<ProfilePage />} /> {/* Own Profile */}
        <Route path="/profile/:username" element={<ProfilePage />} /> {/* Other's Profile */}
        <Route path="/post/:postId" element={<PostPage />} /> {/* Other's Profile */}
        <Route path="/change-username" element={<PrivateRoute element={ChangeUsername} />} />
        <Route path="/change-password" element={<PrivateRoute element={ChangePassword} />} />
        <Route path="/change-photo" element={<PrivateRoute element={ChangePhoto} />} />
        <Route path="/change-description" element={<PrivateRoute element={ChangeDescription} />} />
        <Route path="/help" element={<PrivateRoute element={HelpPage} />} />
        <Route path="/products" element={<PrivateRoute element={ProductPage} />} />
        <Route path="/settings" element={<PrivateRoute element={SettingsPage} />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/posts" element={<PostManagement />} />
        <Route path="/admin/support" element={<Support />} />
        <Route path="/admin/settings" element={<SiteSettings />} />
        <Route path="/admin/product" element={<ProductManagement />} />
        <Route path="/admin/user" element={<UserManagement />} />
        

      </Routes>
    </Router>
  );
}

export default App;
