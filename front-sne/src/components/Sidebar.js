// src/components/Sidebar.js

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FindYourMealModal from './FindYourMealModal';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);

  // Function to navigate to '/' with a unique 'refresh' parameter
  const navigateHome = () => {
    const params = new URLSearchParams(location.search);
    params.delete('fetchMode'); // Remove fetchMode if it exists

    // Set 'refresh' parameter to current timestamp to force refresh
    params.set('refresh', Date.now());

    const newSearch = params.toString() ? `?${params.toString()}` : '';
    navigate(`/${newSearch}`); // Navigate to '/' with 'refresh' parameter
  };

  const handleHomeClick = () => {
    navigateHome();
  };

  const handleTrendsClick = () => {
    navigateHome();
  };

  const handleFollowingsClick = () => {
    const params = new URLSearchParams(location.search);
    params.set('fetchMode', 'followings');
    params.set('refresh', Date.now()); // Unique timestamp to force re-render
    navigate(`/?${params.toString()}`);
  };

  const handleMealSearch = (nutritionValues) => {
    // Optional: Handle additional actions if needed
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

      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={handleFollowingsClick}
      >
        <span className="mr-2">📁</span>
        <span className="text-lg font-medium">Followings</span>
      </div>

      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={handleTrendsClick}
      >
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
