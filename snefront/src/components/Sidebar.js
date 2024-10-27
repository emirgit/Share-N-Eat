import React from 'react';

const Sidebar = () => {
    return (
        <div className="sticky top-16 w-1/5 h-[calc(100vh-4rem)] bg-white p-4 shadow-md flex flex-col items-start overflow-y-auto hover:overflow-y-scroll">
            <div className="flex items-center mb-6">
                <span className="mr-2">🏠</span>
                <span className="text-lg font-medium">Home</span>
            </div>
            <div className="flex items-center mb-6">
                <span className="mr-2">📁</span>
                <span className="text-lg font-medium">Followings</span>
            </div>
            <div className="flex items-center mb-6">
                <span className="mr-2">🔥</span>
                <span className="text-lg font-medium">Trends</span>
            </div>
            {/* Add more sidebar items as needed */}
        </div>
    );
};

export default Sidebar;
