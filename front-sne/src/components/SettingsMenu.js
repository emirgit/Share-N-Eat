import React from 'react';

const SettingsMenu = ({ selectedMenu, setSelectedMenu }) => (
    <div className="w-64 bg-white p-4 rounded-lg shadow-md sticky top-16 h-[calc(100vh-4rem)] space-y-4">
        <button
            className={`w-full text-left py-2 px-4 rounded-lg ${
                selectedMenu === 'Account Preferences'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedMenu('Account Preferences')}
        >
            Account Preferences
        </button>
        <button
            className={`w-full text-left py-2 px-4 rounded-lg ${
                selectedMenu === 'Account Management'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedMenu('Account Management')}
        >
            Account Management
        </button>
        <button
            className={`w-full text-left py-2 px-4 rounded-lg ${
                selectedMenu === 'Data Privacy Rules'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedMenu('Data Privacy Rules')}
        >
            Data Privacy Rules
        </button>
    </div>
);

export default SettingsMenu;
