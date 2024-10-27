import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UploadPage from './pages/UploadPage';

// import ProductPage from './pages/ProductPage';
// import ProfilePage from './pages/ProfilePage';

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<MainPage/>} />
            <Route path="/upload" element={<UploadPage />} />
                {/* <Route path="/product" component={ProductPage} />
                <Route path="/profile" component={ProfilePage} /> */}
            </Routes>
        </Router>
    );
}

export default App;
