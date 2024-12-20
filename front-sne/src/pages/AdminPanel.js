import React from 'react';
import AdminMenu from '../components/AdminMenu';
import AdminNavbar from '../components/AdminNavbar';

const AdminPanel = () => {
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* User Activity */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow hover:shadow-lg transition">
                                <h3 className="text-lg font-semibold text-blue-600">User Activity</h3>
                                <p className="text-gray-600 mt-2">Active Users: <span className="font-bold">4</span></p>
                                <p className="text-gray-600">New Users Today: <span className="font-bold">4</span></p>
                            </div>

                            {/* Post Performance */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow hover:shadow-lg transition">
                                <h3 className="text-lg font-semibold text-green-600">Post Performance</h3>
                                <p className="text-gray-600 mt-2">Total Posts: <span className="font-bold">1</span></p>
                                <p className="text-gray-600">Posts Today: <span className="font-bold">1</span></p>
                            </div>

                            {/* Product Statistics */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow hover:shadow-lg transition">
                                <h3 className="text-lg font-semibold text-yellow-600">Product Statistics</h3>
                                <p className="text-gray-600 mt-2">Total Products: <span className="font-bold">2</span></p>
                                <p className="text-gray-600">New Products: <span className="font-bold">2</span></p>
                            </div>

                            {/* Platform Performance */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow hover:shadow-lg transition">
                                <h3 className="text-lg font-semibold text-red-600">Platform Performance</h3>
                                <p className="text-gray-600 mt-2">Avg. Response Time: <span className="font-bold">320ms</span></p>
                                <p className="text-gray-600">Downtime: <span className="font-bold">0.2%</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Menu */}
                <AdminMenu />
            </div>
        </div>
    );
};

export default AdminPanel;
