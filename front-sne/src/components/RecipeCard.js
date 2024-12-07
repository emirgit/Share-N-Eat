// src/components/RecipeCard.js
import React, { useState, useEffect } from 'react';
import ReactRating from 'react-rating'; // Import the library
import axiosHelper from '../axiosHelper';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#fbbf24', '#8b0000', '#3b82f6']; // Colors for Pie Chart

const RecipeCard = ({ post, userRoles }) => {
    const {
        postId,
        postName,
        description,
        username,
        fat,
        protein,
        carbs,
        calories,
        likeCount,
        averageRateExpert,
        averageRateRegular,
        totalRatersExpert,
        totalRatersRegular,
    } = post;

    const [recipeImage, setRecipeImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [liked, setLiked] = useState(false); // State for Like Button
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount); // State for like count
    const [loadingLike, setLoadingLike] = useState(false); // State to manage like button loading

    // Determine user roles
    const isUser = userRoles.includes('ROLE_USER');

    // Fetch Recipe Image
    useEffect(() => {
        const fetchRecipeImage = async () => {
            try {
                const response = await axiosHelper(`/posts/getImage/${postId}`, 'GET', null, {
                    responseType: 'blob',
                });
                setRecipeImage(URL.createObjectURL(response));
            } catch (error) {
                console.error('Error fetching recipe image:', error);
            }
        };

        if (postId) fetchRecipeImage();
    }, [postId]);

    // Fetch User Profile Image
    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axiosHelper(
                    `/user/${username}/profile-picture`, // Updated URL for user profile picture
                    'GET',
                    null,
                    { responseType: 'blob' }
                );
                setProfileImage(URL.createObjectURL(response));
            } catch (error) {
                console.error('Error fetching profile image:', error);
            }
        };

        if (username) fetchProfileImage();
    }, [username]);

    // Fetch Initial Like Status
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const isLiked = await axiosHelper(`/likes/status/${postId}`, 'GET');
                setLiked(isLiked);
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };

        fetchLikeStatus();
    }, [postId]);

    // Handle Like Button Click
    const handleLike = async () => {
        setLoadingLike(true);
        try {
            if (liked) {
                // If already liked, send DELETE request to unlike
                await axiosHelper(`/likes/${postId}`, 'DELETE');
                setLiked(false);
                setCurrentLikeCount((prev) => prev - 1);
            } else {
                // If not liked, send POST request to like
                await axiosHelper(`/likes/${postId}`, 'POST');
                setLiked(true);
                setCurrentLikeCount((prev) => prev + 1);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('An error occurred while updating your like. Please try again.');
        } finally {
            setLoadingLike(false);
        }
    };

    // Handle Share Button Click
    const handleShare = () => {
        console.log(`Post ID ${postId}: Share button clicked`);
        // TODO: Implement backend logic to handle sharing
    };

    // Handle Comments Button Click
    const handleComments = () => {
        console.log(`Post ID ${postId}: Comments button clicked`);
        // TODO: Redirect or open modal for comments section
    };

    // Handle Follow Button Click
    const handleFollow = () => {
        console.log(`User ${username}: Follow button clicked`);
        // TODO: Implement backend logic to handle follow/unfollow
    };

    const pieData = [
        { name: 'Fat', value: fat },
        { name: 'Protein', value: protein },
        { name: 'Carbs', value: carbs },
    ];

    return (
        <div className="bg-white shadow-md rounded-3xl overflow-hidden mb-6 max-w-4xl">
            {/* User Info */}
            <div className="flex items-center p-4 border-b border-gray-200">
                <img
                    src={profileImage}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                />
                <div className="ml-3 flex-1">
                    <div className="font-semibold">{username}</div>
                    <div className="text-sm text-gray-500">
                        {isUser ? 'User' : 'Expert'}
                    </div>
                </div>
                <button className="text-blue-500" onClick={handleFollow}>
                    Follow
                </button>
            </div>

            {/* Description Section */}
            <div className="p-4 text-gray-700">
                <p>{description || 'This is a delicious recipe that you will love. Try it out and enjoy the flavors!'}</p>
            </div>

            {/* Recipe Image */}
            {recipeImage && (
                <img
                    src={recipeImage}
                    alt={postName}
                    className="w-full max-h-96 object-contain rounded-md mb-3"
                />
            )}

            {/* Recipe Details */}
            <div className="p-4 flex items-center">
                <div className="flex flex-col items-start mr-4">
                    {/* Expert Rating */}
                    <div className="flex items-center mb-1">
                        <ReactRating
                            initialRating={averageRateExpert}
                            readonly={isUser} // Make readonly if user is ROLE_USER
                            emptySymbol={<span className="text-gray-300 text-2xl">☆</span>}
                            fullSymbol={<span className="text-green-500 text-2xl">★</span>}
                            fractions={2} // Supports half stars
                            onChange={(newRating) => {
                                if (!isUser) {
                                    console.log(`Expert Rating for Post ID ${postId}:`, newRating);
                                    // TODO: Implement backend logic to save expert rating
                                }
                            }}
                        />
                        {!isUser && (
                            <span className="ml-2 text-gray-500 text-sm">{totalRatersExpert} rated</span>
                        )}
                        {isUser && (
                            <span className="ml-2 text-gray-400 text-sm flex items-center">
                                <span className="mr-1">Locked</span> 🔒
                            </span>
                        )}
                    </div>

                    {/* Regular Rating */}
                    <div className="flex items-center mb-1">
                        <ReactRating
                            initialRating={averageRateRegular}
                            readonly={!isUser} // Make readonly if not ROLE_USER
                            emptySymbol={<span className="text-gray-300 text-2xl">☆</span>}
                            fullSymbol={<span className="text-yellow-500 text-2xl">★</span>}
                            fractions={2}
                            onChange={(newRating) => {
                                if (isUser) {
                                    console.log(`Regular Rating for Post ID ${postId}:`, newRating);
                                    // TODO: Implement backend logic to save regular rating
                                }
                            }}
                        />
                        {isUser && (
                            <span className="ml-2 text-gray-500 text-sm">{totalRatersRegular} rated</span>
                        )}
                        {!isUser && (
                            <span className="ml-2 text-gray-400 text-sm flex items-center">
                                <span className="mr-1">Locked</span> 🔒
                            </span>
                        )}
                    </div>
                </div>

                {/* Pie Chart */}
                <PieChart width={80} height={80} className="mx-4">
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

                {/* Macros */}
                <div className="flex flex-col ml-4 text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                        <span>🍗</span> <span className="ml-1">{protein}g protein</span>
                    </div>
                    <div className="flex items-center mb-1">
                        <span>🍞</span> <span className="ml-1">{carbs}g carbs</span>
                    </div>
                    <div className="flex items-center mb-1">
                        <span>🥓</span> <span className="ml-1">{fat}g fat</span>
                    </div>
                    <div className="mt-2 text-center">
                        {calories} kcal
                    </div>
                </div>
            </div>

            {/* Interactions */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div className="flex space-x-4">
                    <button 
                        onClick={handleLike} 
                        disabled={loadingLike}
                        className={`flex items-center ${liked ? 'text-red-500' : 'text-blue-500'} 
                                   ${loadingLike ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                        {liked ? '💔 Unlike' : '👍 Like'} {currentLikeCount}
                    </button>
                    <button onClick={handleComments} className="flex items-center text-blue-500">
                        💬 Comments
                    </button>
                </div>
                <button className="text-blue-500" onClick={handleShare}>
                    Share
                </button>
            </div>
        </div>
    );

};

export default RecipeCard;
