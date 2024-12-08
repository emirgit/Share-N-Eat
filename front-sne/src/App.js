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

//import PrivateRoute from './components/PrivateRoute'; // Make sure the path is correct
import ProductPage from './pages/ProductPage';
import AdminPanel from './pages/AdminPanel';
import PostManagement from './pages/PostManagement';
import Support from './pages/Support';
import SiteSettings from './pages/SiteSettings';
import ProductManagement from './pages/ProductManagement';
import UserManagement from './pages/UserManagement';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* private routes removed for now ex: element={<PrivateRoute element={ForgotPassword} />}*/}
        <Route path="/verify-reset" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-username" element={<ChangeUsername />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/change-photo" element={<ChangePhoto />} />
        <Route path="/change-description" element={<ChangeDescription />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/products" element={<ProductPage />} />
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
