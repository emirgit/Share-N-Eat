import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import axiosHelper from '../axiosHelper';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import ProductComment from "./ProductComment";
import {data} from "autoprefixer";

const COLORS = ['#fbbf24', '#8b0000', '#3b82f6']; // Yellow for fat, claret red for protein, blue for carbs

const Star = ({ filled, onClick }) => (
    <svg
        className="w-5 h-5 cursor-pointer"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClick}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.27l5.18 3.73-1.64-6.03 4.46-4.3-6.07-.53L12 2l-2.93 7.34-6.07.53 4.46 4.3-1.64 6.03L12 17.27z"
        />
    </svg>
);

const ProductCard = ({ product, userRoles, currentUsername }) => {
    const navigate = useNavigate();
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [loadingRating, setLoadingRating] = useState(false);

    useEffect(() => {
        const fetchUserRating = async () => {
            try {
                const response = await axiosHelper(`/product-rate/current-user-rate/${product.id}`, 'GET');
                setUserRating(response || 0);
            } catch (error) {
                console.error('Error fetching user rating:', error);
            }
        };

        fetchUserRating();
    }, [product.id]);

    const handleComments = () => {
        setIsCommentsOpen(!isCommentsOpen);
    };

    const handleRatingChange = async (newRating) => {
        if (loadingRating) return;
        setLoadingRating(true);
        try {
            if (userRating === newRating) {
                console.log("anan")
                await axiosHelper(`/product-rate/${product.id}`, 'DELETE');
                setUserRating(0);
            } else {
                console.log("baban")
                const ProductRateRequestDTO = { rating: newRating, productId: product.id };
                await axiosHelper(`/product-rate`, 'POST', data = ProductRateRequestDTO);
                setUserRating(newRating);
            }

        } catch (error) {
            console.error('Error updating rating:', error);
            alert('An error occurred while updating your rating. Please try again.');
        } finally {
            setLoadingRating(false);
        }
    };

    const pieData = [
        { name: 'Fat', value: product.fatGrams },
        { name: 'Protein', value: product.proteinGrams },
        { name: 'Carbs', value: product.carbonhydrateGrams },
    ];

    const renderStars = (rating, maxStars = 5) => {
        const filledStars = Math.round(rating);
        return [...Array(maxStars)].map((_, index) => (
            <Star key={index} filled={index < filledStars} onClick={() => handleRatingChange(index + 1)} />
        ));
    };

    const formattedDate = new Date(product.created).toLocaleDateString();

    return (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-4">
            {/* Left Section: Product Image and Info */}
            <div className="flex items-center">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                />
                <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.quantity}</p>
                    <div className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-lg inline-block">
                        {product.content}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">({formattedDate})</p>
                </div>
            </div>

            {/* Right Section: Ratings, Pie Chart, Macros, Likes & Comments */}
            <div className="flex flex-col items-end space-y-2">
                {/* Star Ratings */}
                <div className="flex flex-col items-end">
                    <div className="flex mb-1 text-blue-500">
                        {renderStars(product.averageRateExpert)}
                    </div>
                    <div className="flex text-yellow-500">
                        {renderStars(product.averageRateRegular)}
                    </div>
                </div>

                {/* Pie Chart and Macronutrient Details */}
                <div className="flex items-center space-x-4">
                    <PieChart width={80} height={80}>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            outerRadius={35}
                            innerRadius={15}
                            paddingAngle={2}
                            isAnimationActive={false}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>

                    {/* Macronutrient Details */}
                    <div className="flex flex-col text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                            <span>🍗</span> <span className="ml-1">{product.proteinGrams}g protein</span>
                        </div>
                        <div className="flex items-center mb-1">
                            <span>🍞</span> <span className="ml-1">{product.carbonhydrateGrams}g carbs</span>
                        </div>
                        <div className="flex items-center mb-1">
                            <span>🥓</span> <span className="ml-1">{product.fatGrams}g fat</span>
                        </div>
                        <div className="mt-2 text-center">
                            {product.calories} kcal
                        </div>
                    </div>
                </div>

                {/* Likes and Comments */}
                <div className="flex space-x-4">
                    <button className="flex items-center text-red-500">
                        <FontAwesomeIcon icon={faHeart} className="mr-1" />
                        {product.likes}
                    </button>
                    <button onClick={handleComments} className="flex items-center text-gray-500">
                        <FontAwesomeIcon icon={faCommentDots} className="mr-1" />
                        {product.comments}
                    </button>
                </div>
            </div>

            {isCommentsOpen && (
                <ProductComment productId={product.id} username={currentUsername} />
            )}
        </div>
    );
};

export default ProductCard;