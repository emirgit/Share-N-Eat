import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecipeCard from '../components/RecipeCard';
import UploadSection from '../components/UploadSection';
import axiosHelper from '../axiosHelper';

const MainPage = () => {
    const [posts, setPosts] = useState([]); // State to hold posts from the backend
    const [loading, setLoading] = useState(false); // Loading state for posts
    const [error, setError] = useState(null); // Error state for posts
    const [roles, setRoles] = useState([]); // State to hold user roles
    const [rolesLoading, setRolesLoading] = useState(true); // Loading state for roles
    const [rolesError, setRolesError] = useState(null); // Error state for roles
    const [currentUsername, setCurrentUsername] = useState(''); // State to hold the current username
    const [usernameLoading, setUsernameLoading] = useState(true); // Loading state for username
    const [usernameError, setUsernameError] = useState(null); // Error state for username

    // Fetch user roles when the component mounts
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await axiosHelper('/user/my-account/roles', 'GET'); // Endpoint to fetch user roles
                setRoles(data); // Set the retrieved roles in state
            } catch (error) {
                console.error('Error fetching user roles:', error);
                setRolesError('Failed to load user roles.');
            } finally {
                setRolesLoading(false); // Mark roles loading as complete
            }
        };

        fetchRoles(); // Call the fetchRoles function
    }, []);

    // Fetch the current username when the component mounts
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const data = await axiosHelper('/user/my-account/username', 'GET'); // Endpoint to fetch username
                setCurrentUsername(data); // Set the retrieved username in state
            } catch (error) {
                console.error('Error fetching username:', error);
                setUsernameError('Failed to load username.');
            } finally {
                setUsernameLoading(false); // Mark username loading as complete
            }
        };

        fetchUsername(); // Call the fetchUsername function
    }, []);

    // Fetch posts only if roles and username are successfully loaded
    useEffect(() => {
        if (!rolesError && !usernameError && !rolesLoading && !usernameLoading) {
            const fetchPosts = async () => {
                setLoading(true); // Start loading posts
                try {
                    const data = await axiosHelper('/posts', 'GET'); // Retrieve posts using axiosHelper
                    setPosts(data); // Set the retrieved posts in state
                } catch (error) {
                    console.error('Error fetching posts:', error);
                    setError('Failed to load posts. Please try again later.');
                } finally {
                    setLoading(false); // Mark loading as complete
                }
            };

            fetchPosts(); // Call the fetchPosts function
        }
    }, [rolesError, usernameError, rolesLoading, usernameLoading]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="flex flex-row">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Feed */}
                <div className="flex-1 flex flex-col">
                    {/* Upload Section */}
                    <UploadSection />

                    {/* Loading State for Username and Roles */}
                    {(rolesLoading || usernameLoading) && (
                        <p className="text-center text-gray-500 mt-4">Loading user data...</p>
                    )}

                    {/* Error State for Username and Roles */}
                    {(rolesError || usernameError) && (
                        <p className="text-center text-red-500 mt-4">
                            {rolesError || usernameError}
                        </p>
                    )}

                    {/* Loading Posts */}
                    {loading && (
                        <p className="text-center text-gray-500 mt-4">Loading posts...</p>
                    )}

                    {/* Error Loading Posts */}
                    {error && (
                        <p className="text-center text-red-500 mt-4">{error}</p>
                    )}

                    {/* Feed Section */}
                    <div className="flex justify-center mt-4">
                        <div className="w-full max-w-4xl">
                            {!loading && posts.length > 0 ? (
                                posts.map((post) => (
                                    <RecipeCard
                                        key={post.postId}
                                        post={post}
                                        userRoles={roles}
                                        currentUsername={currentUsername}
                                    />
                                ))
                            ) : (
                                !loading && !rolesLoading && !usernameLoading && (
                                    <p className="text-center text-gray-500">
                                        No posts available.
                                    </p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
