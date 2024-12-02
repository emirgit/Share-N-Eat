import React from 'react';

const CategoriesSection = ({ onCategorySelect }) => {
    const categories = [
        { name: 'All Products', icon: '🛒' }, // New "All Products" category
        { name: 'Drinks', icon: '🍹' },
        { name: 'Dairy', icon: '🧀' },
        { name: 'Deli', icon: '🥓' },
        { name: 'Seafood', icon: '🐟' },
        { name: 'Junks', icon: '🍟' },
        { name: 'Grains and Legumes', icon: '🌾' },
        { name: 'Fruits and Vegetables', icon: '🍎' },
    ];

    return (
        <div className="bg-gray-100 py-4 px-6 rounded-lg shadow-md mb-6">
            <h3 className="text-gray-700 font-semibold mb-4">Categories</h3>
            <div className="grid grid-cols-8 gap-4">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        onClick={() => onCategorySelect(category.name)}
                        className="flex flex-col items-center space-y-2 text-gray-700 cursor-pointer hover:text-blue-500"
                    >
                        <div className="bg-white rounded-full p-4 shadow-md">
                            <span className="text-2xl">{category.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-center">{category.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesSection;
