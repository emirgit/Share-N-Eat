import React, { useState } from 'react';
import AdminMenu from '../components/AdminMenu';

import AdminNavbar from '../components/AdminNavbar';

const UserManagement = () => {
    // Mock user data
    const [users, setUsers] = useState([
        { id: 1, username: 'theAdmin', email: 'm.emir.kara@outlook.com', role: 'admin', status: 'active', verified: true },
        { id: 2, username: 'DummyTheUser', email: 'dummy@outlook.com', role: 'user', status: 'active', verified: true },
        { id: 3, username: 'DieticianPro', email: 'dietician@outlook.com', role: 'expert', status: 'active', verified: true },
        { id: 4, username: 'trial', email: 'trial@outlook.com', role: 'user', status: 'active', verified: false },
    ]);

    // State for search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Handle search and filtering
    const filteredUsers = users.filter((user) => {
        const matchesSearch = searchQuery
            ? user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        const matchesStatus = statusFilter ? user.status === statusFilter : true;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Handle actions
    const handleBanUser = (id) => {
        setUsers(
            users.map((user) =>
                user.id === id ? { ...user, status: user.status === 'banned' ? 'active' : 'banned' } : user
            )
        );
    };

    const handleAssignRole = (id, newRole) => {
        setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
    };

    const handleVerifyAccount = (id) => {
        setUsers(users.map((user) => (user.id === id ? { ...user, verified: true } : user)));
    };

    const handleResetPassword = (id) => {
        alert(`Password reset link sent to user ID: ${id}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <AdminNavbar/>
            <div className="flex">
                
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-6">User Management</h1>

                    {/* Search and Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search by username or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 border rounded-lg p-2"
                        />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="border rounded-lg p-2"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="expert">Expert</option>
                            <option value="user">User</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border rounded-lg p-2"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
                        </select>
                    </div>

                    {/* User Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="table-auto w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Username</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Verified</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="px-4 py-2">{user.username}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleAssignRole(user.id, e.target.value)}
                                                className="border rounded-lg p-1"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="expert">Expert</option>
                                                <option value="user">User</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm ${
                                                    user.status === 'active'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-600'
                                                }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            {user.verified ? (
                                                <span className="text-green-600">Verified</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleVerifyAccount(user.id)}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Verify
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleBanUser(user.id)}
                                                className={`text-sm px-4 py-2 rounded-lg ${
                                                    user.status === 'banned'
                                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                                        : 'bg-red-500 text-white hover:bg-red-600'
                                                }`}
                                            >
                                                {user.status === 'banned' ? 'Unban' : 'Ban'}
                                            </button>
                                            <button
                                                onClick={() => handleResetPassword(user.id)}
                                                className="ml-4 text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                            >
                                                Reset Password
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Admin Menu */}
                <AdminMenu />
            </div>
        </div>
    );
};

export default UserManagement;
