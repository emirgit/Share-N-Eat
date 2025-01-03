import React, { useState, useEffect, useCallback } from 'react';
import AdminMenu from '../components/AdminMenu';
import AdminNavbar from '../components/AdminNavbar';
import axiosHelper from '../axiosHelper';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [resetModalVisible, setResetModalVisible] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState('');
    const [resetLink, setResetLink] = useState('');

    const fetchUsers = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                size: 10,
                ...(searchQuery && { search: searchQuery }),
                ...(roleFilter && { role: roleFilter }),
                ...(statusFilter && { status: statusFilter })
            });

            const response = await axiosHelper(`/admin/users?${params}`);
            const newUsers = response.content;
            
            if (page === 0) {
                setUsers(newUsers);
            } else {
                setUsers(prevUsers => [...prevUsers, ...newUsers]);
            }
            
            setHasMore(!response.last);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, roleFilter, statusFilter, loading, hasMore]);

    // Reset everything when filters change
    useEffect(() => {
        setUsers([]);
        setPage(0);
        setHasMore(true);
    }, [searchQuery, roleFilter, statusFilter]);

    // Initial load and when page changes
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleScroll = useCallback((event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.target;
        
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    const handleRoleChange = async (username, newRole) => {
        try {
            await axiosHelper(`/admin/user/change-role/${username}/${newRole}`, 'PUT');
            setUsers(users.map((user) =>
                user.username === username ? { ...user, role: newRole } : user
            ));
            alert(`Role changed to ${newRole} for user ${username}`);
        } catch (error) {
            console.error(`Error changing role for ${username}:`, error);
            alert('Failed to change role. Please try again.');
        }
    };

    const handleBanUser = async (username) => {
        try {
            const targetUser = users.find((user) => user.username === username);
            if (targetUser.status === 'banned') {
                await axiosHelper(`/admin/user/unban/${username}`, 'PUT');
                setUsers(users.map((user) => (
                    user.username === username ? { ...user, status: 'active' } : user
                )));
            } else {
                await axiosHelper(`/admin/user/ban/${username}`, 'PUT');
                setUsers(users.map((user) => (
                    user.username === username ? { ...user, status: 'banned' } : user
                )));
            }
        } catch (error) {
            console.error(`Error banning/unbanning user ${username}:`, error);
        }
    };

    const openResetPasswordModal = (email) => {
        setSelectedUserEmail(email);
        setResetModalVisible(true);
    };

    const handleResetPassword = async () => {
        try {
            const response = await axiosHelper(`/admin/reset/password/${selectedUserEmail}`, 'POST');
            setResetLink(response); // Assuming response is the reset link string
        } catch (error) {
            console.error(`Error resetting password for ${selectedUserEmail}:`, error);
        }
    };

    const closeResetPasswordModal = () => {
        setResetModalVisible(false);
        setSelectedUserEmail('');
        setResetLink('');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <AdminNavbar />
            <div className="flex">
                <div className="flex-1 p-8 overflow-auto" onScroll={handleScroll}>
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
                                {users.map((user) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="px-4 py-2">{user.username}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.username, e.target.value)}
                                                className="border rounded-lg p-2"
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
                                                <span className="text-red-600">Not Verified</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 space-x-2">
                                            <button
                                                onClick={() => handleBanUser(user.username)}
                                                className={`text-sm px-4 py-2 rounded-lg ${
                                                    user.status === 'banned'
                                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                                        : 'bg-red-500 text-white hover:bg-red-600'
                                                }`}
                                            >
                                                {user.status === 'banned' ? 'Unban' : 'Ban'}
                                            </button>
                                            <button
                                                onClick={() => openResetPasswordModal(user.email)}
                                                className="text-sm px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                                            >
                                                Reset Password
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {loading && (
                            <div className="text-center py-4">
                                Loading more users...
                            </div>
                        )}
                        
                        {!hasMore && users.length > 0 && (
                            <div className="text-center py-4 text-gray-500">
                                No more users to load.
                            </div>
                        )}
                    </div>

                    {/* Reset Password Modal */}
                    {resetModalVisible && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
                                <p className="mb-4">Email: {selectedUserEmail}</p>
                                {resetLink ? (
                                    <div className="mb-4">
                                        <p className="mb-2">Reset Link:</p>
                                        <div className="flex items-center">
                                            <span className="flex-1 break-all">{resetLink}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(resetLink).then(() => {
                                                        alert('Reset link copied to clipboard!');
                                                    });
                                                }}
                                                className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleResetPassword}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Generate Reset Link
                                    </button>
                                )}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={closeResetPasswordModal}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <AdminMenu />
            </div>
        </div>
    );
};

export default UserManagement;