import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/AdminPanel.css';
import ManageReports from './ManageReports'; // ManageReports bileşenini içe aktarın

// Mock veriler
const mockUsers = ['user1', 'user2', 'admin', 'testUser'];
const mockProducts = ['product_1', 'product_2', 'product_3', 'featured_product'];
const mockPosts = ['post_1', 'post_2', 'post_3', 'featured_post'];

const AdminPanel = () => {
    const [activeAction, setActiveAction] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [entityFound, setEntityFound] = useState(false);
    const navigate = useNavigate();

    const handleAction = (action) => {
        setActiveAction(action);
        setInputValue('');
        setEntityFound(false);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setEntityFound(false);
    };

    const handleCheckEntity = () => {
        if (
            (activeAction === 'Assign Role' && mockUsers.includes(inputValue)) ||
            (activeAction === 'Ban/Unban User' && mockUsers.includes(inputValue)) ||
            (activeAction === 'Verify Account' && mockUsers.includes(inputValue)) ||
            (activeAction === 'Modify Product' && mockProducts.includes(inputValue)) ||
            (activeAction === 'Post Management' && mockPosts.includes(inputValue))
        ) {
            setEntityFound(true);
        } else {
            alert(
                `"${inputValue}" ${
                    activeAction === 'Modify Product'
                        ? 'ürün'
                        : activeAction === 'Post Management'
                        ? 'post'
                        : 'kullanıcı'
                } bulunamadı.`
            );
        }
    };

    const handleActionSubmit = (text) => {
        if (inputValue) {
            alert(`${text} işlemi "${inputValue}" için gerçekleştirildi!`);
        } else {
            alert(`${text} işlemi gerçekleştirildi!`);
        }
        setActiveAction(null);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="admin-panel">
            <Navbar />
            <div className="admin-panel-content flex">
                <Sidebar />

                {/* Ana içerik alanı */}
                <div className="main-content p-4 flex-1">
                    <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

                    {activeAction && (
                        <div className="action-bar mt-6 p-4 bg-gray-100 border rounded-lg shadow-md">
                            <h2 className="text-lg font-bold mb-4">{activeAction}</h2>

                            {/* See Dashboard için butonlar */}
                            {activeAction === 'See Dashboard' && (
                                <div className="dashboard-buttons mt-4 flex flex-col gap-4">
                                    <button
                                        className="role-button"
                                        onClick={() => handleNavigate('/user-activity')}
                                    >
                                        User Activity
                                    </button>
                                    <button
                                        className="role-button"
                                        onClick={() => handleNavigate('/post-performance')}
                                    >
                                        Post Performance
                                    </button>
                                    <button
                                        className="role-button"
                                        onClick={() => handleNavigate('/product-statistics')}
                                    >
                                        Product Statistics
                                    </button>
                                    <button
                                        className="role-button"
                                        onClick={() => handleNavigate('/platform-performance')}
                                    >
                                        Platform Performance
                                    </button>
                                </div>
                            )}

                            {/* Site Settings için butonlar */}
                            {activeAction === 'Site Settings' && (
                                <div className="site-settings-buttons mt-4 flex flex-col gap-4">
                                    <button
                                        className="role-button"
                                        onClick={() => handleActionSubmit('Modified Terms of Service')}
                                    >
                                        Modify Terms of Service
                                    </button>
                                    <button
                                        className="role-button"
                                        onClick={() => handleActionSubmit('Modified Privacy Policy')}
                                    >
                                        Modify Privacy Policy
                                    </button>
                                </div>
                            )}

                            {/* Input ve Kontroller */}
                            {[
                                'Assign Role',
                                'Ban/Unban User',
                                'Verify Account',
                                'Modify Product',
                                'Post Management',
                            ].includes(activeAction) && (
                                <>
                                    <input
                                        type="text"
                                        placeholder={`Enter ${
                                            activeAction === 'Modify Product'
                                                ? 'product name'
                                                : activeAction === 'Post Management'
                                                ? 'post ID'
                                                : 'username'
                                        }...`}
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded w-full mb-4"
                                    />
                                    <button
                                        className="submit-button"
                                        onClick={handleCheckEntity}
                                        disabled={!inputValue}
                                    >
                                        Check{' '}
                                        {activeAction === 'Modify Product'
                                            ? 'Product'
                                            : activeAction === 'Post Management'
                                            ? 'Post'
                                            : 'User'}
                                    </button>

                                    {entityFound && (
                                        <div className="role-buttons mt-4 flex flex-col gap-4">
                                            {/* Assign Role Butonları */}
                                            {activeAction === 'Assign Role' && (
                                                <>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Assigned Role: User')
                                                        }
                                                    >
                                                        User
                                                    </button>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Assigned Role: Dietitian')
                                                        }
                                                    >
                                                        Dietitian
                                                    </button>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Assigned Role: Admin')
                                                        }
                                                    >
                                                        Admin
                                                    </button>
                                                </>
                                            )}

                                            {/* Ban/Unban User Butonları */}
                                            {activeAction === 'Ban/Unban User' && (
                                                <>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Banned the User')
                                                        }
                                                    >
                                                        Ban the User
                                                    </button>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Unbanned the User')
                                                        }
                                                    >
                                                        Unban the User
                                                    </button>
                                                </>
                                            )}

                                            {/* Verify Account Butonları */}
                                            {activeAction === 'Verify Account' && (
                                                <>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Verified the Account')
                                                        }
                                                    >
                                                        Verify the Account
                                                    </button>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Unverified the Account')
                                                        }
                                                    >
                                                        Unverify the Account
                                                    </button>
                                                </>
                                            )}

                                            {/* Modify Product Butonları */}
                                            {activeAction === 'Modify Product' && (
                                                <>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Verified the Product')
                                                        }
                                                    >
                                                        Verify Product
                                                    </button>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Deleted the Product')
                                                        }
                                                    >
                                                        Delete Product
                                                    </button>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Highlighted the Product')
                                                        }
                                                    >
                                                        Highlight Product
                                                    </button>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit(
                                                                'Changed Product Information'
                                                            )
                                                        }
                                                    >
                                                        Change Information of Product
                                                    </button>
                                                </>
                                            )}

                                            {/* Post Management Butonları */}
                                            {activeAction === 'Post Management' && (
                                                <>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Edited Post Content')
                                                        }
                                                    >
                                                        Edit Post Content
                                                    </button>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Deleted the Post')
                                                        }
                                                    >
                                                        Delete Post
                                                    </button>
                                                    <button
                                                        className="role-button"
                                                        onClick={() =>
                                                            handleActionSubmit('Highlighted the Post')
                                                        }
                                                    >
                                                        Highlight the Post
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Manage Reports Bileşeni */}
                            {activeAction === 'Manage Reports' && <ManageReports />}
                        </div>
                    )}
                </div>

                {/* Sağdaki Admin Panel Sidebar */}
                <div className="admin-sidebar flex flex-col p-4 w-1/5 bg-white shadow-md">
                    <button
                        className="admin-sidebar-button"
                        onClick={() => handleAction('See Dashboard')}
                    >
                        See Dashboard
                    </button>
                    <button
                        className="admin-sidebar-button"
                        onClick={() => handleAction('Post Management')}
                    >
                        Post Management
                    </button>
                    <button
                        className="admin-sidebar-button"
                        onClick={() => handleAction('Modify Product')}
                    >
                        Modify Product
                    </button>
                    <button
                        className="admin-sidebar-button"
                        onClick={() => handleAction('Assign Role')}
                    >
                        Assign Role
                    </button>
                    <button
                        className="admin-sidebar-button"
                        onClick={() => handleAction('Ban/Unban User')}
                    >
                        Ban/Unban User
                    </button>
                    <button
                        className="admin-sidebar-button"
                        onClick={() => handleAction('Verify Account')}
                    >
                        Verify Account
                    </button>
                    <button
                        className="admin-sidebar-button"
                        onClick={() => handleAction('Manage Reports')}
                    >
                        Manage Reports
                    </button>
                    {/* Yeni Site Settings Butonu */}
                    <button
                        className="admin-sidebar-button"
                        onClick={() => handleAction('Site Settings')}
                    >
                        Site Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
