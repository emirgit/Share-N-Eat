import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductUpload from '../components/ProductUpload';
import ProductCard from '../components/ProductCard';
import CategoriesSection from '../components/CategoriesSection';

const ProductPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [sortOption, setSortOption] = useState('');
    const allProducts = [
        {
            id: 1,
            name: 'Milk',
            category: 'Dairy',
            contents: 'Lactose-Free Milk',
            dateAdded: '2024-11-25',
            quantity: '500ml',
            imageUrl: 'https://via.placeholder.com/100',
            certifiedRating: 4.2,
            nonCertifiedRating: 3.8,
            macronutrients: { protein: 10, carbs: 5, fat: 2, calories: 100 },
            likes: 12,
            comments: 5,
        },
        {
            id: 2,
            name: 'Orange Juice',
            category: 'Drinks',
            contents: 'Freshly Squeezed Orange Juice',
            dateAdded: '2024-11-24',
            quantity: '1L',
            imageUrl: 'https://via.placeholder.com/100',
            certifiedRating: 4.5,
            nonCertifiedRating: 4.0,
            macronutrients: { protein: 1, carbs: 20, fat: 0, calories: 80 },
            likes: 8,
            comments: 3,
        },
        {
            id: 3,
            name: 'Ham',
            category: 'Deli',
            contents: 'Smoked Ham',
            dateAdded: '2024-11-23',
            quantity: '300g',
            imageUrl: 'https://via.placeholder.com/100',
            certifiedRating: 4.0,
            nonCertifiedRating: 3.7,
            macronutrients: { protein: 25, carbs: 0, fat: 5, calories: 200 },
            likes: 15,
            comments: 6,
        },
        {
            id: 4,
            name: 'Salmon',
            category: 'Seafood',
            contents: 'Fresh Atlantic Salmon',
            dateAdded: '2024-11-22',
            quantity: '200g',
            imageUrl: 'https://via.placeholder.com/100',
            certifiedRating: 4.8,
            nonCertifiedRating: 4.5,
            macronutrients: { protein: 22, carbs: 0, fat: 12, calories: 250 },
            likes: 20,
            comments: 8,
        },
        {
            id: 5,
            name: 'Chips',
            category: 'Junks',
            contents: 'Classic Salted Chips',
            dateAdded: '2024-11-21',
            quantity: '200g',
            imageUrl: 'https://via.placeholder.com/100',
            certifiedRating: 3.5,
            nonCertifiedRating: 3.2,
            macronutrients: { protein: 3, carbs: 25, fat: 15, calories: 300 },
            likes: 10,
            comments: 2,
        },
        {
            id: 6,
            name: 'Quinoa',
            category: 'Grains and Legumes',
            contents: 'Organic Quinoa',
            dateAdded: '2024-11-20',
            quantity: '500g',
            imageUrl: 'https://via.placeholder.com/100',
            certifiedRating: 4.6,
            nonCertifiedRating: 4.3,
            macronutrients: { protein: 12, carbs: 35, fat: 5, calories: 180 },
            likes: 18,
            comments: 7,
        },
        {
            id: 7,
            name: 'Apple',
            category: 'Fruits and Vegetables',
            contents: 'Fresh Red Apple',
            dateAdded: '2024-11-19',
            quantity: '1kg',
            imageUrl: 'https://via.placeholder.com/100',
            certifiedRating: 4.9,
            nonCertifiedRating: 4.7,
            macronutrients: { protein: 1, carbs: 30, fat: 0, calories: 120 },
            likes: 22,
            comments: 9,
        },
    ];

    const handleSort = (option) => {
        setSortOption(option);
    };

    const filteredProducts =
        selectedCategory === 'All Products'
            ? allProducts
            : allProducts.filter((product) => product.category === selectedCategory);

    const sortedProducts = filteredProducts.slice().sort((a, b) => {
        switch (sortOption) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'rating':
                return b.certifiedRating - a.certifiedRating;
            case 'protein':
                return b.macronutrients.protein - a.macronutrients.protein;
            case 'carbs':
                return b.macronutrients.carbs - a.macronutrients.carbs;
            case 'fat':
                return b.macronutrients.fat - a.macronutrients.fat;
            default:
                return 0; // No sorting
        }
    });

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 px-8 py-4">
                    {/* Categories Section */}
                    <CategoriesSection onCategorySelect={setSelectedCategory} />

                    {/* Add Product Section */}
                    <div className="flex justify-between items-center mb-6">
                        <ProductUpload />
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex justify-end mb-6">
                        <select
                            value={sortOption}
                            onChange={(e) => handleSort(e.target.value)}
                            className="border p-2 rounded-lg"
                        >
                            <option value="">Sort by</option>
                            <option value="name">Sort by Name</option>
                            <option value="rating">Sort by Rating</option>
                            <option value="protein">Sort by Protein</option>
                            <option value="carbs">Sort by Carbs</option>
                            <option value="fat">Sort by Fat</option>
                        </select>
                    </div>

                    {/* Product Feed */}
                    <div>
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;


// const allProducts = [
//     {
//         id: 1,
//         name: 'Milk',
//         category: 'Dairy',
//         contents: 'Lactose-Free Milk',
//         dateAdded: '2024-11-25',
//         quantity: '500ml',
//         imageUrl: 'https://via.placeholder.com/100',
//         certifiedRating: 4.2,
//         nonCertifiedRating: 3.8,
//         macronutrients: { protein: 10, carbs: 5, fat: 2, calories: 100 },
//         likes: 12,
//         comments: 5,
//     },
//     {
//         id: 2,
//         name: 'Orange Juice',
//         category: 'Drinks',
//         contents: 'Freshly Squeezed Orange Juice',
//         dateAdded: '2024-11-24',
//         quantity: '1L',
//         imageUrl: 'https://via.placeholder.com/100',
//         certifiedRating: 4.5,
//         nonCertifiedRating: 4.0,
//         macronutrients: { protein: 1, carbs: 20, fat: 0, calories: 80 },
//         likes: 8,
//         comments: 3,
//     },
//     {
//         id: 3,
//         name: 'Ham',
//         category: 'Deli',
//         contents: 'Smoked Ham',
//         dateAdded: '2024-11-23',
//         quantity: '300g',
//         imageUrl: 'https://via.placeholder.com/100',
//         certifiedRating: 4.0,
//         nonCertifiedRating: 3.7,
//         macronutrients: { protein: 25, carbs: 0, fat: 5, calories: 200 },
//         likes: 15,
//         comments: 6,
//     },
//     {
//         id: 4,
//         name: 'Salmon',
//         category: 'Seafood',
//         contents: 'Fresh Atlantic Salmon',
//         dateAdded: '2024-11-22',
//         quantity: '200g',
//         imageUrl: 'https://via.placeholder.com/100',
//         certifiedRating: 4.8,
//         nonCertifiedRating: 4.5,
//         macronutrients: { protein: 22, carbs: 0, fat: 12, calories: 250 },
//         likes: 20,
//         comments: 8,
//     },
//     {
//         id: 5,
//         name: 'Chips',
//         category: 'Junks',
//         contents: 'Classic Salted Chips',
//         dateAdded: '2024-11-21',
//         quantity: '200g',
//         imageUrl: 'https://via.placeholder.com/100',
//         certifiedRating: 3.5,
//         nonCertifiedRating: 3.2,
//         macronutrients: { protein: 3, carbs: 25, fat: 15, calories: 300 },
//         likes: 10,
//         comments: 2,
//     },
//     {
//         id: 6,
//         name: 'Quinoa',
//         category: 'Grains and Legumes',
//         contents: 'Organic Quinoa',
//         dateAdded: '2024-11-20',
//         quantity: '500g',
//         imageUrl: 'https://via.placeholder.com/100',
//         certifiedRating: 4.6,
//         nonCertifiedRating: 4.3,
//         macronutrients: { protein: 12, carbs: 35, fat: 5, calories: 180 },
//         likes: 18,
//         comments: 7,
//     },
//     {
//         id: 7,
//         name: 'Apple',
//         category: 'Fruits and Vegetables',
//         contents: 'Fresh Red Apple',
//         dateAdded: '2024-11-19',
//         quantity: '1kg',
//         imageUrl: 'https://via.placeholder.com/100',
//         certifiedRating: 4.9,
//         nonCertifiedRating: 4.7,
//         macronutrients: { protein: 1, carbs: 30, fat: 0, calories: 120 },
//         likes: 22,
//         comments: 9,
//     },
// ];