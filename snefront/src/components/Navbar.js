import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import userProfilePic from '../assets/profilepic-shrneat.png'; // Replace with the actual path to the user's profile image

const Navbar = () => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        // Navigate to the profile page when the profile picture is clicked
        navigate('/profile');
    };

    return (
        <nav className="sticky top-0 z-20 w-full flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center">
                <img 
                    src={logo} 
                    alt="Share'n Eat Logo" 
                    className="w-10 h-10 mr-2" 
                />
                <div className="text-xl font-bold text-green-600">share’n eat</div>
            </div>
            <input 
                type="text" 
                placeholder="What do you cook ?" 
                className="flex-1 mx-4 p-2 rounded-3xl border border-gray-300"
            />
            {/* User Profile Image */}
            <div 
                className="cursor-pointer"
                onClick={handleProfileClick}
            >
                <img 
                    src={userProfilePic} 
                    alt="User Profile" 
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                />
            </div>
        </nav>
    );
};

export default Navbar;