import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMenu = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', onClick: () => navigate('/admin') },
        { name: 'User Management', onClick: () => navigate('/admin/user') },
        { name: 'Product Management', onClick: () => navigate('/admin/product') },
        { name: 'Site Settings', onClick: () => navigate('/admin/settings') },
        { name: 'Support', onClick: () => navigate('/admin/support') },
    ];

    return (
        <div className="w-1/5 bg-white shadow-md rounded-lg p-4 sticky top-16 h-[calc(100vh-4rem)]">
            <h3 className="text-lg font-semibold mb-4">Admin Menu</h3>
            <ul className="space-y-2">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        onClick={item.onClick}
                        className="cursor-pointer text-gray-700 hover:text-blue-500"
                    >
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminMenu;
