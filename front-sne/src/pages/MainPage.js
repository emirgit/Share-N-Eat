import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecipeCard from '../components/RecipeCard';
import UploadSection from '../components/UploadSection';
import axiosHelper from '../axiosHelper';

const MainPage = () => {
    // State to hold posts from the backend
    const [posts, setPosts] = useState([]);

    // Fetch posts from the backend when the component mounts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Use the axiosHelper to fetch posts
                const data = await axiosHelper('/posts', 'GET'); // The token is automatically handled by axiosHelper
                setPosts(data); // Set the retrieved posts in the state
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts(); // Call the fetchPosts function when the component mounts
    }, []);


    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Main Content with Sidebar and Feed */}
            <div className="flex flex-row">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Feed */}
                <div className="flex-1 flex flex-col">
                    {/* Upload Section */}
                    <UploadSection />

                    {/* Feed Section */}
                    <div className="flex justify-center mt-4">
                        <div className="w-full max-w-4xl">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <RecipeCard
                                        key={post.postId}
                                        user={{
                                            profilePic: `http://localhost:8080/api/post/images/${post.username}.jpg`, // Profile picture path
                                            name: post.username,
                                            followStatus: 'Qualified', // Adjust this if needed
                                            isQualified: true, // Adjust this if needed
                                        }}
                                        recipe={{
                                            imageUrl: `http://localhost:8080${post.imageUrl}`, // Use imageUrl from PostResponse
                                            title: post.postName,
                                            description: post.description,
                                            protein: post.protein,
                                            carbs: post.carbs,
                                            fat: post.fat,
                                            likes: post.likeCount,
                                            comments: post.totalRatersRegular + post.totalRatersExpert,
                                            calories: post.calories,
                                        }}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No posts available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
