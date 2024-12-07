import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import axiosHelper from '../axiosHelper';
import RecipeCard from '../components/RecipeCard';

const ProfilePage = () => {
    const [user, setUser] = useState({
        username: '',
        isCertified: false,
        bio: '',
        followers: 0,
        following: 0,
    });
    const [userPosts, setUserPosts] = useState([]); // State for user's posts
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newBio, setNewBio] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    // Fetch user data and their posts
    useEffect(() => {
        const fetchUserDataAndPosts = async () => {
            try {
                // Fetch user data
                const userData = await axiosHelper('/user/my-account', 'GET');
                setUser({
                    username: userData.username,
                    isCertified: userData.isCertified,
                    bio: userData.bio,
                    followers: userData.followersCount,
                    following: userData.followingCount,
                });
                setNewUsername(userData.username);
                setNewBio(userData.bio);

                // Fetch profile picture
                const profilePictureResponse = await axiosHelper('user/my-account/profile-picture', 'GET', null, {
                    responseType: 'blob',
                });
                setProfilePictureUrl(URL.createObjectURL(profilePictureResponse));

                // Fetch user's posts
                const posts = await axiosHelper('/posts/current-user', 'GET');
                setUserPosts(posts);
            } catch (error) {
                console.error('Error fetching user data or posts', error);
            }
        };

        fetchUserDataAndPosts();
    }, []);

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
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('profilePhoto', file);

                await axiosHelper('/user/my-account/upload-photo', 'PUT', formData, {
                    'Content-Type': 'multipart/form-data',
                });

                setProfilePictureUrl(URL.createObjectURL(file));
            } catch (error) {
                console.error('Error uploading profile photo', error);
            }
        }
    };

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
                                src={profilePictureUrl}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                            <div
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
                            </div>
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    {isEditing ? (
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
                                {!isEditing && (
                                    <button
                                        onClick={handleEditClick}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                            <div className="text-gray-500 mt-1">
                                {user.isCertified ? 'Certified User' : 'Not Certified'}
                            </div>
                            <div className="mt-4">
                                {isEditing ? (
                                    <textarea
                                        value={newBio}
                                        onChange={(e) => setNewBio(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                ) : (
                                    <p className="text-gray-700">{user.bio}</p>
                                )}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={handleSaveChanges}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User's Posts Feed */}
                    <div className="w-full max-w-4xl space-y-6">
                        {userPosts.length > 0 ? (
                            userPosts.map((post) => (
                                <RecipeCard key={post.postId} post={post} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No posts available for this user.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
