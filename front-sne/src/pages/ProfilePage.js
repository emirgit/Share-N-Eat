
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import ramenImg from '../assets/ramen.jpeg';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState({
        username: '',
        isCertified: false,
        bio: '',
        followers: 0,
        following: 0,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(user.username);
    const [newBio, setNewBio] = useState(user.bio);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    useEffect(() => {
        const fetchUserDataAndProfilePicture = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("Authorization token is missing");
                    return;
                }
                
                const userDataResponse = await axios.get('http://localhost:8080/api/user/my-account', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                const userData = userDataResponse.data;
                setUser({
                    username: userData.username,
                    isCertified: userData.isCertified,
                    bio: userData.bio,
                    followers: userData.followersCount,
                    following: userData.followingCount,
                });
                setNewUsername(userData.username);
                setNewBio(userData.bio);

                const profilePictureResponse = await axios.get('http://localhost:8080/api/user/my-account/profile-picture', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob',
                });
                setProfilePictureUrl(URL.createObjectURL(profilePictureResponse.data));

            } catch (error) {
                console.error("Error fetching user data or profile picture", error);
            }
        };

        fetchUserDataAndProfilePicture();
    }, []);
    

    const posts = [
        { id: 1, imageUrl: ramenImg },
        { id: 2, imageUrl: ramenImg },
        { id: 3, imageUrl: ramenImg },
        { id: 4, imageUrl: ramenImg },
    ];

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Authorization token is missing");
                return;
            }
            
            console.log("Saving changes:", { newUsername, newBio });
            
            await axios.put('http://localhost:8080/api/user/my-account', {
                username: newUsername,
                bio: newBio,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser({
                ...user,
                username: newUsername,
                bio: newBio,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving user data", error);
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append('profilePhoto', file); // 'profilePhoto' is the key used in the backend
    
                // Upload the file to the backend
                await axios.put('http://localhost:8080/api/user/my-account/upload-photo', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data', // Required for file uploads
                    },
                });
    
                // Update the profile picture preview
                setProfilePictureUrl(URL.createObjectURL(file));
            } catch (error) {
                console.error("Error uploading profile photo", error);
            }
        }
    };
    

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-row w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center p-8">
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
                    <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div 
                                key={post.id} 
                                className="bg-white rounded-3xl shadow-md overflow-hidden"
                            >
                                <img
                                    src={post.imageUrl}
                                    alt="User's post"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">Recipe Title</h3>
                                    <p className="text-gray-600 text-sm">A delicious recipe to try out!</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
