import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecipeCard from '../components/RecipeCard';
import axiosHelper from '../axiosHelper';

const PostPage = () => {
    const { postId } = useParams(); // Extract postId from URL
    const [post, setPost] = useState(null); // State to hold the post data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [roles, setRoles] = useState([]); // User roles
    const [currentUsername, setCurrentUsername] = useState(''); // Current user's username

    // Fetch user roles and username when the component mounts
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const [rolesData, usernameData] = await Promise.all([
                    axiosHelper('/user/my-account/roles', 'GET'),
                    axiosHelper('/user/my-account/username', 'GET')
                ]);

                setRoles(rolesData); // Set user roles
                setCurrentUsername(usernameData); // Set current username
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError('Failed to load user details.');
            }
        };

        fetchUserDetails();
    }, []);

    // Fetch the specific post based on postId
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true); // Start loading
                const data = await axiosHelper(`/posts/${postId}`, 'GET');
                setPost(data); // Set the post data
            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Failed to load the post.');
            } finally {
                setLoading(false); // Mark loading as complete
            }
        };

        fetchPost();
    }, [postId]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="flex flex-row">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Post Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    {loading && <p className="text-gray-500">Loading post...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {post && (
                        <div className="w-full max-w-4xl">
                            <RecipeCard
                                post={post}
                                userRoles={roles}
                                currentUsername={currentUsername}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostPage;
