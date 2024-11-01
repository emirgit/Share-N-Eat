import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ramenImg from '../assets/ramen.jpeg';
import userImg from '../assets/profilepic-shrneat.png'
const ProfilePage = () => {
    // User data with initial state values for editing
    const [user, setUser] = useState({
        profilePhoto: userImg, // Placeholder image
        username: 'JohnDoe',
        isCertified: true,
        description: 'Food lover and passionate chef. I love to share my favorite recipes with everyone!',
        followers: 1200,
        following: 180,
    });
    
    const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
    const [newUsername, setNewUsername] = useState(user.username);
    const [newDescription, setNewDescription] = useState(user.description);
    const [newPhoto, setNewPhoto] = useState(user.profilePhoto);

    const posts = [
        { id: 1, imageUrl: ramenImg },
        { id: 2, imageUrl: ramenImg },
        { id: 3, imageUrl: ramenImg },
        { id: 4, imageUrl: ramenImg },
        // Add more posts as needed
    ];

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        // Update user details with new data
        setUser({
            ...user,
            username: newUsername,
            description: newDescription,
            profilePhoto: newPhoto,
        });
        setIsEditing(false); // Exit edit mode
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setNewPhoto(URL.createObjectURL(file));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-row w-full">
                {/* Sidebar */}
                <Sidebar />

                {/* Profile Content */}
                <div className="flex-1 flex flex-col items-center p-8">
                    {/* Profile Info Section */}
                    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8 mb-8 flex items-start">
                        {/* Profile Photo */}
                        <div className="relative w-32 h-32 mr-6">
                            <img
                                src={newPhoto}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                            {isEditing && (
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handlePhotoChange} 
                                    className="mt-2"
                                />
                            )}
                        </div>

                        {/* Username, Certification, Followers, and Description */}
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
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                ) : (
                                    <p className="text-gray-700">{user.description}</p>
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

                    {/* User's Posts Collection */}
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
