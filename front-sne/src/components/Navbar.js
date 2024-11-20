import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State for the settings sub-menu
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const navigate = useNavigate();
    const dropdownRef = useRef(null); // Ref for the dropdown

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
        setIsSubMenuOpen(false); // Close sub-menu if dropdown is closed
    };

    // Toggle sub-menu visibility for Settings
    const handleSettingsClick = () => {
        setIsSubMenuOpen((prev) => !prev);
    };

    // Function to close dropdown and sub-menu if click is outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
            setIsSubMenuOpen(false);
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

    // Navigate to Profile Page
    const navigateToProfile = () => {
        navigate('/profile');
        setIsDropdownOpen(false); // Close dropdown after navigation
    };

    // Sub-menu navigation function
    const navigateTo = (path) => {
        navigate(path);
        setIsDropdownOpen(false);
        setIsSubMenuOpen(false);
    };

    // Logout function to navigate to Login Page
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth/login');
        setIsDropdownOpen(false);
        setIsSubMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-20 w-full flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
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
                //Temporarily will not be used
                //value={searchQuery}
                //onChange={handleSearch} // Trigger search on input change
                className="flex-1 mx-4 p-2 rounded-3xl border border-gray-300"
            />
            
            {/* User Profile Image and Dropdown */}
            <div className="relative">
                <img
                    src={profilePictureUrl || 'defaultProfilePic.png'}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
                    onClick={handleProfileClick}
                />
                
                {/* Main Dropdown Menu */}
                {isDropdownOpen && (
                    <div
                        ref={dropdownRef} // Attach ref to the dropdown menu
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                        <ul className="py-2">
                            <li 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={navigateToProfile}
                            >
                                View Profile
                            </li>
                            <li 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
                                onClick={handleSettingsClick}
                            >
                                Settings
                                {/* Sub-Menu for Settings */}
                                {isSubMenuOpen && (
                                    <div className="absolute right-full top-0 mt-0 ml-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <ul className="py-2">
                                            <li 
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => navigateTo('/verify-reset')}
                                            >
                                                Change Password
                                            </li>
                                            <li
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                                                onClick={() => navigateTo('/delete-account')}
                                            >
                                                Delete Account
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                            <li 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigateTo('/help')}
                            >
                                Help
                            </li>
                            <li 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                                onClick={handleLogout} // Redirect to LoginPage on logout
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

export default Navbar;
