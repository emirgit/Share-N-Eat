import React, { useState, useEffect } from 'react';
import AdminMenu from '../components/AdminMenu';
import AdminNavbar from '../components/AdminNavbar';
import axiosHelper from '../axiosHelper';

const AdminPanel = () => {
    const [userCount, setUserCount] = useState(null);
    const [postCount, setPostCount] = useState(null);
    const [productCount, setProductCount] = useState(null);
    const [dailyUserCount, setDailyUserCount] = useState(null);
    const [dailyPostCount, setDailyPostCount] = useState(null);
    const [dailyProductCount, setDailyProductCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);

                const [
                    userResponse,
                    postResponse,
                    productResponse,
                    dailyUserResponse,
                    dailyPostResponse,
                    dailyProductResponse,
                ] = await Promise.all([
                    axiosHelper('/user/count', 'GET'),
                    axiosHelper('/posts/count', 'GET'),
                    axiosHelper('/products/count', 'GET'),
                    axiosHelper('/user/count/daily', 'GET'),
                    axiosHelper('/posts/count/daily', 'GET'),
                    axiosHelper('/products/count/daily', 'GET'),
                ]);

                setUserCount(userResponse);
                setPostCount(postResponse);
                setProductCount(productResponse);
                setDailyUserCount(dailyUserResponse);
                setDailyPostCount(dailyPostResponse);
                setDailyProductCount(dailyProductResponse);
            } catch (err) {
                console.error('Error fetching statistics:', err);
                setError('Failed to load statistics. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar */}
            <AdminNavbar />

            {/* Main Layout */}
            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
                    <p className="text-gray-600">Monitor and manage platform activities here.</p>

                    {/* Dashboard Content */}
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>

                        {loading ? (
                            <p className="text-gray-500">Loading statistics...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* User Activity */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow hover:shadow-lg transition">
                                    <h3 className="text-lg font-semibold text-blue-600">User Activity</h3>
                                    <p className="text-gray-600 mt-2">
                                        Total Users: <span className="font-bold">{userCount}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        New Users Today: <span className="font-bold">{dailyUserCount}</span>
                                    </p>
                                </div>

                                {/* Post Performance */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow hover:shadow-lg transition">
                                    <h3 className="text-lg font-semibold text-green-600">Post Performance</h3>
                                    <p className="text-gray-600 mt-2">
                                        Total Posts: <span className="font-bold">{postCount}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        Posts Today: <span className="font-bold">{dailyPostCount}</span>
                                    </p>
                                </div>

                                {/* Product Statistics */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow hover:shadow-lg transition">
                                    <h3 className="text-lg font-semibold text-yellow-600">Product Statistics</h3>
                                    <p className="text-gray-600 mt-2">
                                        Total Products: <span className="font-bold">{productCount}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        New Products: <span className="font-bold">{dailyProductCount}</span>
                                    </p>
                                </div>
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

export default AdminPanel;
