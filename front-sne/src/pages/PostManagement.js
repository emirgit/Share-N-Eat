import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminMenu from '../components/AdminMenu';

const PostManagement = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            username: 'Alice',
            description: 'This is a delicious recipe I tried!',
            imageUrl: 'https://via.placeholder.com/150',
        },
        {
            id: 2,
            username: 'Bob',
            description: 'Check out my awesome salad bowl!',
            imageUrl: 'https://via.placeholder.com/150',
        },
        {
            id: 3,
            username: 'Charlie',
            description: 'My latest creation: spicy ramen!',
            imageUrl: 'https://via.placeholder.com/150',
        },
    ]);

    const handleDelete = (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this post?');
        if (confirmed) {
            setPosts(posts.filter((post) => post.id !== id));
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Admin Navbar */}
            <AdminNavbar />

            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-6">Post Management</h1>
                    <div className="w-full max-w-4xl space-y-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
                                {/* Post Image */}
                                <img src={post.imageUrl} alt="Post" className="w-20 h-20 rounded-lg object-cover" />
                                {/* Post Info */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{post.username}</h3>
                                    <p className="text-gray-600">{post.description}</p>
                                </div>
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}

                        {posts.length === 0 && (
                            <div className="text-gray-500 text-center">
                                <p>No posts to moderate.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Admin Menu */}
                <AdminMenu />
            </div>
        </div>
    );
};

export default PostManagement;
