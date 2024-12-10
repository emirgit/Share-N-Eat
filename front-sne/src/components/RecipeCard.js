// src/components/RecipeCard.js
import React, { useState, useEffect } from 'react';
import ReactRating from 'react-rating';
import axiosHelper from '../axiosHelper';
import { PieChart, Pie, Cell } from 'recharts';
import Comment from '../components/Comment';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#fbbf24', '#8b0000', '#3b82f6'];

const RecipeCard = ({ post, userRoles, currentUsername }) => {
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

    const navigate = useNavigate();
    const [recipeImage, setRecipeImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [liked, setLiked] = useState(false);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const [loadingLike, setLoadingLike] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    // Rating States
    const [userRating, setUserRating] = useState(0);
    const [currentAverageExpert, setCurrentAverageExpert] = useState(averageRateExpert);
    const [currentAverageRegular, setCurrentAverageRegular] = useState(averageRateRegular);
    const [currentTotalRatersExpert, setCurrentTotalRatersExpert] = useState(totalRatersExpert);
    const [currentTotalRatersRegular, setCurrentTotalRatersRegular] = useState(totalRatersRegular);
    const [loadingRating, setLoadingRating] = useState(false);

    const isUser = userRoles.includes('ROLE_USER');

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

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axiosHelper(`/user/${username}/profile-picture`, 'GET', null, {
                    responseType: 'blob'
                });
                setProfileImage(URL.createObjectURL(response));
            } catch (error) {
                console.error('Error fetching profile image:', error);
            }
        };

        if (username) fetchProfileImage();
    }, [username]);

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

    useEffect(() => {
        const fetchUserRating = async () => {
            try {
                const response = await axiosHelper(`/rates/current-user-rate/${postId}`, 'GET');
                setUserRating(response || 0);
            } catch (error) {
                console.error('Error fetching user rating:', error);
            }
        };

        fetchUserRating();
    }, [postId]);

    const handleLike = async () => {
        setLoadingLike(true);
        try {
            if (liked) {
                await axiosHelper(`/likes/${postId}`, 'DELETE');
                setLiked(false);
                setCurrentLikeCount((prev) => prev - 1);
            } else {
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

    const handleShare = () => {
        // It will be changed instead of hardcoded t o widnow
        const link = `http://localhost:3000/post/${postId}`;
        navigator.clipboard.writeText(link) // Copy the link to the clipboard
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(() => {
                alert('Failed to copy link. Please try again.');
            });
    };
    

    const handleComments = () => {
        setIsCommentsOpen(!isCommentsOpen);
    };

    const handleRatingChange = async (newRating) => {
        if (loadingRating) return;
        setLoadingRating(true);
        try {
            if (userRating === newRating) {
                await axiosHelper(`/rates/${postId}`, 'DELETE');
                setUserRating(0);
                await fetchUpdatedAverages();
            } else {
                const rateDto = { rating: newRating, postId };
                await axiosHelper(`/rates`, 'POST', rateDto);
                setUserRating(newRating);
                await fetchUpdatedAverages();
            }
        } catch (error) {
            console.error('Error updating rating:', error);
            alert('An error occurred while updating your rating. Please try again.');
        } finally {
            setLoadingRating(false);
        }
    };

    const fetchUpdatedAverages = async () => {
        try {
            const updatedPost = await axiosHelper(`/posts/${postId}`, 'GET');
            setCurrentAverageExpert(updatedPost.averageRateExpert);
            setCurrentAverageRegular(updatedPost.averageRateRegular);
            setCurrentTotalRatersExpert(updatedPost.totalRatersExpert);
            setCurrentTotalRatersRegular(updatedPost.totalRatersRegular);
        } catch (error) {
            console.error('Error fetching updated averages:', error);
        }
    };

    const pieData = [
        { name: 'Fat', value: fat },
        { name: 'Protein', value: protein },
        { name: 'Carbs', value: carbs },
    ];

    return (
        <div className="bg-white shadow-md rounded-3xl overflow-hidden mb-6 max-w-4xl">
            <div className="flex items-center p-4 border-b border-gray-200">
                {profileImage && (
                    <img
                        src={profileImage}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                        onClick={() => navigate(`/profile/${username}`)}
                    />
                )}
                <div className="ml-3 flex-1">
                    <div className="font-semibold">{username}</div>
                    <div className="text-sm text-gray-500">
                        {'User'}
                    </div>
                </div>
            </div>

            <div className="p-4 text-gray-700">
                <p>{description || 'This is a delicious recipe that you will love. Try it out and enjoy the flavors!'}</p>
            </div>

            {recipeImage && (
                <img
                    src={recipeImage}
                    alt={postName}
                    className="w-full max-h-96 object-contain rounded-md mb-3"
                />
            )}

            <div className="p-4 flex items-center">
                <div className="flex flex-col items-start mr-4">
                    <div className="flex items-center mb-1">
                        <ReactRating
                            initialRating={currentAverageExpert}
                            readonly={isUser}
                            emptySymbol={<span className="text-gray-300 text-2xl">☆</span>}
                            fullSymbol={<span className="text-green-500 text-2xl">★</span>}
                            fractions={2}
                            onChange={(newRating) => {
                                if (!isUser) {
                                    handleRatingChange(newRating);
                                }
                            }}
                        />
                        {!isUser && (
                            <span className="ml-2 text-gray-500 text-sm">{currentTotalRatersExpert} rated</span>
                        )}
                        {isUser && (
                            <span className="ml-2 text-gray-400 text-sm flex items-center">
                                <span className="mr-1">{currentTotalRatersExpert} rated</span> 🔒
                            </span>
                        )}
                    </div>

                    <div className="flex items-center mb-1">
                        <ReactRating
                            initialRating={currentAverageRegular}
                            readonly={!isUser}
                            emptySymbol={<span className="text-gray-300 text-2xl">☆</span>}
                            fullSymbol={<span className="text-yellow-500 text-2xl">★</span>}
                            fractions={2}
                            onChange={(newRating) => {
                                if (isUser) {
                                    handleRatingChange(newRating);
                                }
                            }}
                        />
                        {isUser && (
                            <span className="ml-2 text-gray-500 text-sm">{currentTotalRatersRegular} rated</span>
                        )}
                        {!isUser && (
                            <span className="ml-2 text-gray-400 text-sm flex items-center">
                                <span className="mr-1">{currentTotalRatersRegular} rated</span> 🔒
                            </span>
                        )}
                    </div>
                </div>

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

            {isCommentsOpen && (
                // Pass both postId and currentUsername (logged-in user's username) to Comment
                <Comment postId={postId} username={currentUsername} />
            )}
        </div>
    );
};

export default RecipeCard;
