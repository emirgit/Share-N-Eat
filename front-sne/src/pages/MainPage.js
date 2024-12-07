import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecipeCard from '../components/RecipeCard';
import UploadSection from '../components/UploadSection';
import axiosHelper from '../axiosHelper';

const MainPage = () => {
    const [posts, setPosts] = useState([]); // State to hold posts from the backend
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch posts from the backend when the component mounts
    useEffect(() => {
        const fetchPosts = async () => {
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
    }, []);

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

                    {/* Loading State */}
                    {loading && (
                        <p className="text-center text-gray-500 mt-4">Loading posts...</p>
                    )}

                    {/* Error State */}
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
                                        post={post} // Pass the entire post object
                                    />
                                ))
                            ) : (
                                !loading && (
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
    