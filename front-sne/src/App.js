import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import ChangeUsername from './pages/ChangeUsername';
import ChangePassword from './pages/ChangePassword';
import ChangePhoto from './pages/ChangeUsername';
import ChangeDescription from './pages/ChangeDescription';
import HelpPage from './pages/HelpPage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel'; // Admin Panel bileşeni eklendi

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/change-username" element={<ChangeUsername />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/change-photo" element={<ChangePhoto />} />
                <Route path="/change-description" element={<ChangeDescription />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPanel />} /> {/* Admin Panel rotası */}
            </Routes>
        </Router>
    );
}

export default App;
