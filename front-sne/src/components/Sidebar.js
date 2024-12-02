import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleAdminPanelClick = () => {
        navigate('/admin'); // Admin Panel'e yönlendirme
    };

    return (
        <div className="sticky top-16 w-1/5 h-[calc(100vh-4rem)] bg-white p-4 shadow-md flex flex-col items-start overflow-y-auto hover:overflow-y-scroll">
            <div
                className="flex items-center mb-6 cursor-pointer"
                onClick={handleHomeClick}
            >
                <span className="mr-2">🏠</span>
                <span className="text-lg font-medium">Home</span>
            </div>
            <div className="flex items-center mb-6 cursor-pointer">
                <span className="mr-2">📁</span>
                <span className="text-lg font-medium">Followings</span>
            </div>
            <div className="flex items-center mb-6 cursor-pointer">
                <span className="mr-2">🔥</span>
                <span className="text-lg font-medium">Trends</span>
            </div>
            <div
                className="flex items-center mb-6 cursor-pointer"
                onClick={handleAdminPanelClick}
            >
                <span className="mr-2">⚙️</span>
                <span className="text-lg font-medium">Admin Panel</span>
            </div>
            {/* Add more sidebar items as needed */}
        </div>
    );
};

export default Sidebar;
