// src/components/Navbar.js

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import axiosHelper from '../axiosHelper';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // Import useLocation
    const dropdownRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('user');
    const [searchResults, setSearchResults] = useState([]); 
    const [showSearchResults, setShowSearchResults] = useState(false); // Controls visibility of search dropdown
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // Store images fetched for results to avoid memory leaks
    const [imageURLs, setImageURLs] = useState({}); // {id or username: objectURL}

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const profilePictureResponse = await axiosHelper('/user/my-account/profile-picture', 'GET', null, {
                    responseType: 'blob', 
                });
                setProfilePictureUrl(URL.createObjectURL(profilePictureResponse));
            } catch (error) {
                console.error("Failed to fetch profile picture", error);
            }
        };
    
        fetchProfilePicture();
    }, []);

    const handleProfileClick = () => {
        setIsDropdownOpen((prev) => !prev);
        setIsSubMenuOpen(false);
    };

    const handleSettingsClick = () => {
        navigate('/settings');
        setIsDropdownOpen(false);
    };

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

    const navigateToProfile = () => {
        navigate('/profile');
        setIsDropdownOpen(false);
    };

    const navigateTo = (path) => {
        navigate(path);
        setIsDropdownOpen(false);
        setIsSubMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth/login');
        setIsDropdownOpen(false);
        setIsSubMenuOpen(false);
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        // If you want live search, you could call handleSearch here with debounce
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        // If you want to trigger search immediately, you can call handleSearch() here
    };

    const handleSearchKeyDown = async (e) => {
        if (e.key === 'Enter') {
            await handleSearch();
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setShowSearchResults(false);
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        setSearchError(null);
        setShowSearchResults(true);
        setSearchResults([]);
        setImageURLs({});

        try {
            const endpoint = `/search?param=${selectedCategory}&query=${encodeURIComponent(searchQuery)}&page=0&size=8`;
            const response = await axiosHelper(endpoint, 'GET');

            // Response is a page of data depending on category
            let results = response.content || response; 

            if (response.content) {
                results = response.content;
            } else {
                // If not paginated or different shape, just assume results = response
            }

            // Fetch images for each result as needed
            const updatedImageURLs = {};
            for (let item of results) {
                if (selectedCategory === 'user') {
                    const uname = item.username;
                    const imgBlob = await fetchUserImage(uname);
                    if (imgBlob) {
                        updatedImageURLs[uname] = imgBlob;
                    }
                } else if (selectedCategory === 'post') {
                    const pid = item.postId;
                    const imgBlob = await fetchPostImage(pid);
                    if (imgBlob) {
                        updatedImageURLs[pid] = imgBlob;
                    }
                } else if (selectedCategory === 'product') {
                    const prodId = item.id;
                    const imgBlob = await fetchProductImage(prodId);
                    if (imgBlob) {
                        updatedImageURLs[prodId] = imgBlob;
                    }
                }
            }

            setImageURLs(updatedImageURLs);
            setSearchResults(results);
        } catch (error) {
            console.error('Error performing search:', error);
            setSearchError('Failed to fetch search results.');
        } finally {
            setSearchLoading(false);
        }
    };

    const fetchUserImage = async (uname) => {
        try {
            const response = await axiosHelper(`/user/${uname}/profile-picture`, 'GET', null, {
                responseType: 'blob'
            });
            return URL.createObjectURL(response);
        } catch (error) {
            console.error('Error fetching user image:', error);
            return null;
        }
    };

    const fetchPostImage = async (postId) => {
        try {
            const response = await axiosHelper(`/posts/getImage/${postId}`, 'GET', null, {
                responseType: 'blob'
            });
            return URL.createObjectURL(response);
        } catch (error) {
            console.error('Error fetching post image:', error);
            return null;
        }
    };

    const fetchProductImage = async (productId) => {
        try {
            const response = await axiosHelper(`/products/getImage/${productId}`, 'GET', null, {
                responseType: 'blob'
            });
            return URL.createObjectURL(response);
        } catch (error) {
            console.error('Error fetching product image:', error);
            return null;
        }
    };

    // Click handler for search results
    const handleResultClick = (item) => {
        let link = '';
        if (selectedCategory === 'user') {
            link = `/profile/${item.username}`;
        } else if (selectedCategory === 'post') {
            link = `/post/${item.postId}`;
        } else if (selectedCategory === 'product') {
            link = `/product/${item.id}`;
        }
        navigate(link);
        setShowSearchResults(false);
    };

    // Handle Navbar Logo Click
    const handleLogoClick = () => {
        const params = new URLSearchParams(location.search);
        params.delete('fetchMode'); // Remove fetchMode if it exists
        // params.delete('refresh');    // Do not delete 'refresh' to allow multiple refreshes

        // Append a new 'refresh' parameter with current timestamp
        params.set('refresh', Date.now());

        const newSearch = params.toString() ? `?${params.toString()}` : '';
        navigate(`/${newSearch}`); // Navigate to '/' with 'refresh' parameter
    };

    return (
        <nav className="sticky top-0 z-20 w-full flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
                <img 
                    src={logo} 
                    alt="Share'n Eat Logo" 
                    className="w-10 h-10 mr-2" 
                />
                <div className="text-xl font-bold text-green-600">share’n eat</div>
            </div>

            {/* Search Container */}
            <div className="flex-1 mx-4 relative">
                <div className="flex items-center border border-gray-300 rounded-3xl p-2">
                    <input 
                        type="text" 
                        placeholder="What do you cook ?"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        onKeyDown={handleSearchKeyDown}
                        className="flex-1 focus:outline-none text-sm"
                    />
                    {/* Category Dropdown */}
                    <div className="ml-2 pl-2 border-l border-gray-200">
                        <select 
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="bg-white text-sm focus:outline-none"
                        >
                            <option value="user">User</option>
                            <option value="product">Product</option>
                            <option value="post">Post</option>
                        </select>
                    </div>
                </div>

                {showSearchResults && (
                    <div className="absolute left-0 mt-2 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        {searchLoading && <p className="p-2 text-gray-500">Loading...</p>}
                        {searchError && <p className="p-2 text-red-500">{searchError}</p>}
                        {!searchLoading && !searchError && searchResults.length === 0 && (
                            <p className="p-2 text-gray-500">No results found.</p>
                        )}
                        {!searchLoading && !searchError && searchResults.length > 0 && (
                            <ul className="divide-y divide-gray-200 max-h-64 overflow-auto">
                                {searchResults.map((item) => {
                                    let title = '';
                                    let imageKey = '';
                                    if (selectedCategory === 'user') {
                                        title = `${item.username} (${item.role})`;
                                        imageKey = item.username;
                                    } else if (selectedCategory === 'post') {
                                        title = item.postName;
                                        imageKey = item.postId;
                                    } else if (selectedCategory === 'product') {
                                        // Either name or brand, show both
                                        title = item.brand ? `${item.name} - ${item.brand}` : item.name;
                                        imageKey = item.id;
                                    }

                                    const imgURL = imageURLs[imageKey];

                                    return (
                                        <li 
                                            key={imageKey}
                                            className="p-2 flex items-center cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleResultClick(item)}
                                        >
                                            {imgURL && (
                                                <img
                                                    src={imgURL}
                                                    alt="Result"
                                                    className="w-10 h-10 rounded-full mr-2 object-cover"
                                                />
                                            )}
                                            <span className="text-sm text-gray-700">{title}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* User Profile Image and Dropdown */}
            <div className="relative">
                <img
                    src={profilePictureUrl || 'defaultProfilePic.png'}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
                    onClick={handleProfileClick}
                />
                
                {isDropdownOpen && (
                    <div
                        ref={dropdownRef}
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
                            </li>
                            <li 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigateTo('/help')}
                            >
                                Help
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

export default Navbar;
