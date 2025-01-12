// src/components/Sidebar.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FindYourMealModal from './FindYourMealModal';

const Sidebar = ({ setFetchMode, onRefresh, currentFetchMode }) => {
  const navigate = useNavigate();
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);

  const handleHomeClick = () => {
    if (currentFetchMode === 'trendings') {
      onRefresh(); // Trigger refresh if already in 'trendings' mode
    } else {
      setFetchMode('trendings');
      navigate('/');
    }
  };

  const handleFollowingsClick = () => {
    if (currentFetchMode === 'followings') {
      onRefresh(); // Trigger refresh if already in 'followings' mode
    } else {
      setFetchMode('followings');
      navigate('/');
    }
  };

  const handleTrendsClick = () => {
    if (currentFetchMode === 'trendings') {
      onRefresh(); // Trigger refresh if already in 'trendings' mode
    } else {
      setFetchMode('trendings');
      navigate('/');
    }
  };

  const handleMealSearch = (nutritionValues) => {
    // Implement meal search functionality
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
