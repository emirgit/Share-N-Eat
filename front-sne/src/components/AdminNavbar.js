import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

const AdminNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null); // Ref for the dropdown
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    // Fetch user profile picture on component mount
    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/user/my-account/profile-picture', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob',
                });
                setProfilePictureUrl(URL.createObjectURL(response.data));
            } catch (error) {
                console.error("Failed to fetch profile picture", error);
            }
        };

        fetchProfilePicture();
    }, []);

    // Toggle dropdown visibility
    const handleProfileClick = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Navigate to Admin Dashboard
    const navigateToDashboard = () => {
        navigate('/admin');
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth/login');
    };

    return (
        <nav className="sticky top-0 z-20 w-full flex items-center justify-between p-4 bg-white shadow-md">
            {/* Logo Section */}
            <div className="flex items-center cursor-pointer" onClick={navigateToDashboard}>
                <img 
                    src={logo} 
                    alt="Admin Logo" 
                    className="w-10 h-10 mr-2" 
                />
                <div className="text-xl font-bold text-green-600">admi'n eat</div>
            </div>

            {/* User Profile Image and Dropdown */}
            <div className="relative">
                <img
                    src={profilePictureUrl || 'defaultProfilePic.png'}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
                    onClick={handleProfileClick}
                />
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                        <ul className="py-2">
                            <li 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigate('/settings')}
                            >
                                Settings
                            </li>
                            <li 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                                onClick={handleLogout}
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default AdminNavbar;
