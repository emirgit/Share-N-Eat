// src/components/RecipeCard.js
import React, { useState, useEffect } from 'react';
import RatingComponent from './RatingComponent'; // <-- Import new component
import axiosHelper from '../axiosHelper';
import { PieChart, Pie, Cell } from 'recharts';
import Comment from '../components/Comment';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#fbbf24', '#8b0000', '#3b82f6'];

const RecipeCard = ({ post, currentUsername }) => {
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

    // New States for User Roles
    const [currentUserRole, setCurrentUserRole] = useState([]); // State to hold current user roles
    const [rolesLoading, setRolesLoading] = useState(true); // Loading state for roles
    const [rolesError, setRolesError] = useState(null); // Error state for roles

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const data = await axiosHelper('/user/my-account/roles', 'GET'); // Endpoint to fetch user roles
                setCurrentUserRole(data); // Set the retrieved roles in state
            } catch (error) {
                console.error('Error fetching user roles:', error);
                setRolesError('Failed to load user roles.');
            } finally {
                setRolesLoading(false); // Mark roles loading as complete
            }
        };

        fetchUserRoles(); // Call the fetchUserRoles function
    }, []);

    // Determine if the user has ROLE_USER
    const isUser = currentUserRole.includes('ROLE_USER');

    useEffect(() => {
        const fetchRecipeImage = async () => {
            try {
                const response = await axiosHelper(`/posts/getImage/${postId}`, 'GET', null, { responseType: 'blob' });
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
                const response = await axiosHelper(`/user/${username}/profile-picture`, 'GET', null, { responseType: 'blob' });
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

    // Like / Unlike logic
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

    // Share logic
    const handleShare = () => {
        const link = `http://localhost:3000/post/${postId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(() => {
                alert('Failed to copy link. Please try again.');
            });
    };

    // Comments toggle
    const handleComments = () => {
        setIsCommentsOpen(!isCommentsOpen);
    };

    // Pie chart data
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
                        className="w-10 h-10 rounded-full cursor-pointer"
                        onClick={() => navigate(`/profile/${username}`)}
                    />
                )}
                <div className="ml-3 flex-1">
                    <div className="font-semibold">{username}</div>
                    <div className="text-sm text-gray-500">
                        {rolesLoading ? (
                            'Loading role...'
                        ) : rolesError ? (
                            'Role unavailable'
                        ) : (
                            currentUserRole.length > 0
                                ? currentUserRole[0].replace('ROLE_', '').toLowerCase()
                                : 'No Role'
                        )}
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

            {/* Rating + Pie Chart section */}
            <div className="p-4 flex items-center">
                {/* Handle loading and error states for roles */}
                {rolesLoading && (
                    <p className="text-gray-500 mr-4">Loading roles...</p>
                )}
                {rolesError && (
                    <p className="text-red-500 mr-4">{rolesError}</p>
                )}

                {/* Only show ratings if roles are loaded and no error */}
                {!rolesLoading && !rolesError && (
                    <div className="flex flex-col items-start mr-4">
                        {/* Expert Rating */}
                        <RatingComponent
                            postId={postId}
                            isExpertRating={true}
                            isReadOnly={isUser} // If the user has ROLE_USER, they cannot rate as expert
                            initialAverage={averageRateExpert}
                            initialTotalRaters={totalRatersExpert}
                            currentUserRole={currentUserRole}
                        />

                        {/* Regular Rating */}
                        <RatingComponent
                            postId={postId}
                            isExpertRating={false}
                            isReadOnly={!isUser} // If the user is not role user, rating is read-only for regular
                            initialAverage={averageRateRegular}
                            initialTotalRaters={totalRatersRegular}
                            currentUserRole={currentUserRole}
                        />
                    </div>
                )}

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

                {/* Macronutrient Info */}
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

            {/* Like / Comment / Share Section */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div className="flex space-x-4">
                    <button
                        onClick={handleLike}
                        disabled={loadingLike}
                        className={`
                            flex items-center 
                            ${liked ? 'text-red-500' : 'text-blue-500'}
                            ${loadingLike ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        `}
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
                <Comment postId={postId} username={currentUsername} />
            )}
        </div>
    );
};

export default RecipeCard;
