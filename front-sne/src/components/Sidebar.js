import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FindYourMealModal from './FindYourMealModal';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleMealSearch = (nutritionValues) => {
        console.log('Search criteria:', nutritionValues);
        // Here you would typically navigate to search results or filter the current view
        // navigate('/', { state: { nutritionFilters: nutritionValues } });
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
                onClick={() => setIsMealModalOpen(true)}
            >
                <span className="mr-2">🍽️</span>
                <span className="text-lg font-medium">Find Your Meal</span>
            </div>
            <div
                className="flex items-center mb-6 cursor-pointer"
                onClick={() => navigate('/products')}
            >
                <span className="mr-2">🛒</span>
                <span className="text-lg font-medium">Products</span>
            </div>
            
            <FindYourMealModal 
                isOpen={isMealModalOpen}
                onClose={() => setIsMealModalOpen(false)}
                onSubmit={handleMealSearch}
            />
        </div>
    );
};

export default Sidebar;
