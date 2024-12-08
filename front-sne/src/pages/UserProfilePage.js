// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to access URL parameters
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import axiosHelper from '../axiosHelper';

const ProfilePage = () => {
    const { username: routeUsername } = useParams(); // Get the username from the URL
    const isOwnProfile = !routeUsername; // If no username in URL, it's the current user's profile

    const [user, setUser] = useState({
        username: '',
        isCertified: false,
        bio: '',
        followers: 0,
        following: 0,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newBio, setNewBio] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    // Fetch user data and profile picture
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let userData;
                let profilePictureResponse;

                if (isOwnProfile) {
                    // Fetch current user's data
                    userData = await axiosHelper('/user/my-account', 'GET');
                    profilePictureResponse = await axiosHelper('/user/my-account/profile-picture', 'GET', null, {
                        responseType: 'blob',
                    });
                } else {
                    // Fetch other user's data
                    userData = await axiosHelper(`/user/${routeUsername}`, 'GET');
                    profilePictureResponse = await axiosHelper(`/user/${routeUsername}/profile-picture`, 'GET', null, {
                        responseType: 'blob',
                    });
                }

                setUser({
                    username: userData.username,
                    isCertified: userData.isCertified,
                    bio: userData.bio,
                    followers: userData.followersCount,
                    following: userData.followingCount,
                });

                setNewUsername(userData.username);
                setNewBio(userData.bio);

                setProfilePictureUrl(URL.createObjectURL(profilePictureResponse));
            } catch (error) {
                console.error('Error fetching user data', error);
                // Optionally, handle user not found or other errors
            }
        };

        fetchUserData();
    }, [routeUsername, isOwnProfile]);

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
                                    {isOwnProfile && isEditing ? (
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
                                {isOwnProfile && !isEditing && (
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
                                {isOwnProfile && isEditing ? (
                                    <textarea
                                        value={newBio}
                                        onChange={(e) => setNewBio(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                ) : (
                                    <p className="text-gray-700">{user.bio}</p>
                                )}
                            </div>
                            {isOwnProfile && isEditing && (
                                <button
                                    onClick={handleSaveChanges}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Optional: Display Followers and Following with links */}
                    {/* You can add more sections like user's posts, activities, etc., here */}

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
