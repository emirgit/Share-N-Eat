// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import axiosHelper from '../axiosHelper';
import RecipeCard from '../components/RecipeCard'; // Ensure this import exists

const ProfilePage = () => {
    const { username } = useParams(); // Extract username from URL
    const [currentUsername, setCurrentUsername] = useState(null); // To store current user's username
    const [user, setUser] = useState({
        username: '',
        role: '',
        bio: '',
        followers: 0,
        following: 0,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newBio, setNewBio] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [loading, setLoading] = useState(true); // For loading state
    const [error, setError] = useState(null); // For error handling
    const [isFollowing, setIsFollowing] = useState(false); // To track follow status
    const [followLoading, setFollowLoading] = useState(false); // To prevent multiple requests

    // New state variables for posts
    const [posts, setPosts] = useState([]); // To store fetched posts
    const [postsLoading, setPostsLoading] = useState(true); // Loading state for posts
    const [postsError, setPostsError] = useState(null); // Error state for posts

    // Utility function to map backend roles to display-friendly strings
    const getDisplayRole = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return 'Admin';
            case 'ROLE_EXPERT':
                return 'Expert';
            case 'ROLE_USER':
                return 'User';
            default:
                return 'Unknown Role';
        }
    };

    // Fetch current user's username
    useEffect(() => {
        const fetchCurrentUsername = async () => {
            try {
                const currentUsernameData = await axiosHelper('/user/my-account/username', 'GET');
                console.log(currentUsernameData)
                setCurrentUsername(currentUsernameData); // Assuming the response has a 'username' field
            } catch (err) {
                console.error('Error fetching current username', err);
                setError('Failed to fetch current user data.');
            }
        };

        fetchCurrentUsername();
    }, []);

    // Fetch profile data based on whether it's own profile or another's
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                let fetchedUser;
                let pictureResponse;

                if (!username || username === currentUsername) {
                    // Viewing own profile
                    setIsOwnProfile(true);
                    fetchedUser = await axiosHelper('/user/my-account', 'GET');
                    pictureResponse = await axiosHelper('/user/my-account/profile-picture', 'GET', null, {
                        responseType: 'blob',
                    });
                } else {
                    // Viewing another user's profile
                    setIsOwnProfile(false);
                    fetchedUser = await axiosHelper(`/user/${username}`, 'GET');
                    pictureResponse = await axiosHelper(`/user/${username}/profile-picture`, 'GET', null, {
                        responseType: 'blob',
                    });

                    // Check if the current user is following this user
                    const followingStatus = await axiosHelper(`/follows/current-user/${username}/is-following`, 'GET');
                    setIsFollowing(followingStatus);
                }

                setUser({
                    username: fetchedUser.username,
                    role: fetchedUser.role, // Updated to store role
                    bio: fetchedUser.bio,
                    followers: fetchedUser.followersCount,
                    following: fetchedUser.followingCount,
                });
                setNewUsername(fetchedUser.username);
                setNewBio(fetchedUser.bio);

                setProfilePictureUrl(URL.createObjectURL(pictureResponse));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data', err);
                setError('Failed to fetch user data.');
                setLoading(false);
            }
        };

        // Only fetch user data after current username is available
        if (currentUsername !== null) {
            fetchUserData();
        }
    }, [username, currentUsername]);

    // Fetch posts based on the profile being viewed
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setPostsLoading(true); // Start loading posts
                setPostsError(null); // Reset any previous errors
                // Determine which username to use
                const targetUsername = isOwnProfile ? currentUsername : user.username;
                // Fetch posts by user
                console.log(targetUsername)
                const fetchedPosts = await axiosHelper(`/posts/by-user/${targetUsername}`, 'GET');

                setPosts(fetchedPosts); // Set the fetched posts
            } catch (error) {
                console.error('Error fetching posts:', error);
                setPostsError('Failed to load posts.');
            } finally {
                setPostsLoading(false); // Mark loading as complete
            }
        };
        // Fetch posts only after user data is available
        if (currentUsername && user.username) {

            fetchPosts();
        }
    }, [currentUsername, user.username, isOwnProfile]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        try {
            await axiosHelper('/user/my-account', 'PUT', {
                username: newUsername,
                bio: newBio,
            });
            setUser((prev) => ({
                ...prev,
                username: newUsername,
                bio: newBio,
            }));
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving user data', error);
            setError('Failed to save changes.');
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file && isOwnProfile) { // Only allow photo change on own profile
            try {
                const formData = new FormData();
                formData.append('profilePhoto', file);

                await axiosHelper('/user/my-account/upload-photo', 'PUT', formData, {
                    'Content-Type': 'multipart/form-data',
                });

                setProfilePictureUrl(URL.createObjectURL(file));
            } catch (error) {
                console.error('Error uploading profile photo', error);
                setError('Failed to upload profile photo.');
            }
        }
    };

    const handleFollowToggle = async () => {
        if (followLoading) return; // Prevent multiple clicks

        setFollowLoading(true);
        try {
            if (isFollowing) {
                // Unfollow the user
                await axiosHelper('/follows/unfollow', 'DELETE', {
                    followerUsername: currentUsername,
                    followedUsername: user.username,
                });
                setIsFollowing(false);

                // Decrease the follower count dynamically
                setUser((prevUser) => ({
                    ...prevUser,
                    followers: prevUser.followers - 1,
                }));
            } else {
                // Follow the user
                await axiosHelper('/follows/follow', 'POST', {
                    followerUsername: currentUsername,
                    followedUsername: user.username,
                });
                setIsFollowing(true);

                // Increase the follower count dynamically
                setUser((prevUser) => ({
                    ...prevUser,
                    followers: prevUser.followers + 1,
                }));
            }
        } catch (error) {
            console.error('Error toggling follow status', error);
            setError('Failed to update follow status.');
        } finally {
            setFollowLoading(false);
        }
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-700">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-row w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center p-8">
                    {/* Profile Section */}
                    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8 mb-8 flex items-start">
                        <div className="relative w-32 h-32 mr-6">
                            <img
                                src={profilePictureUrl || '/default-profile.png'} // Fallback image
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                            {isOwnProfile && (
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
                                </div>
                            )}
                            {isOwnProfile && (
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            )}
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    {isEditing && isOwnProfile ? (
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="text-2xl font-bold mr-4 border p-1 rounded"
                                        />
                                    ) : (
                                        <div className="text-2xl font-bold mr-4">{user.username}</div>
                                    )}
                                    <div className="flex items-center text-gray-600 space-x-4">
                                        <div>
                                            <span className="font-semibold">{user.followers}</span> Followers
                                        </div>
                                        <div>
                                            <span className="font-semibold">{user.following}</span> Following
                                        </div>
                                    </div>
                                </div>
                                {!isEditing && isOwnProfile && (
                                    <button
                                        onClick={handleEditClick}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                                {!isOwnProfile && (
                                    <button
                                        onClick={handleFollowToggle}
                                        className={`px-4 py-2 rounded-lg ${isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                                        disabled={followLoading}
                                    >
                                        {followLoading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                )}
                            </div>
                            <div className="text-gray-500 mt-1">
                                {/* Updated role display */}
                                {getDisplayRole(user.role)}
                            </div>
                            <div className="mt-4">
                                {isEditing && isOwnProfile ? (
                                    <textarea
                                        value={newBio}
                                        onChange={(e) => setNewBio(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                ) : (
                                    <p className="text-gray-700">{user.bio}</p>
                                )}
                            </div>
                            {isEditing && isOwnProfile && (
                                <button
                                    onClick={handleSaveChanges}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Posts Section */}
                    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8">
                        <h2 className="text-2xl font-semibold mb-4">Posts</h2>

                        {/* Loading State */}
                        {postsLoading && (
                            <p className="text-center text-gray-500">Loading posts...</p>
                        )}

                        {/* Error State */}
                        {postsError && (
                            <p className="text-center text-red-500">{postsError}</p>
                        )}

                        {/* No Posts */}
                        {!postsLoading && !postsError && posts.length === 0 && (
                            <p className="text-center text-gray-500">No posts available.</p>
                        )}

                        {/* Display Posts */}
                        {!postsLoading && !postsError && posts.length > 0 && (
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <RecipeCard
                                        key={post.id}
                                        post={post}
                                        userRoles={user.role ? [user.role] : []} // Assuming roles is an array
                                        currentUsername={currentUsername}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Additional Sections (e.g., User's Posts) */}
                    {/* ... */}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
