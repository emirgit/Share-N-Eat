import React, { useState } from 'react';

const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState('AccountPreferences'); // State to track active section

    // Handler for changing sections
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    // Components for each section
    const AccountPreferences = () => (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Account Preferences</h2>
            <p className="mb-4">Update your profile information below:</p>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleSectionChange('UpdateProfile')}
            >
                Update Profile Information
            </button>
        </div>
    );

    const UpdateProfile = () => (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
            <form className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="block w-full p-2 border rounded"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    className="block w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    className="ml-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => handleSectionChange('AccountPreferences')}
                >
                    Cancel
                </button>
            </form>
        </div>
    );

    const AccountManagement = () => (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Account Management</h2>
            <button
                className="block px-4 py-2 mb-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => handleSectionChange('ChangePassword')}
            >
                Change Password
            </button>
            <button
                className="block px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleSectionChange('UpdateEmail')}
            >
                Update Email Address
            </button>
            <button
                className="block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleSectionChange('DeleteAccount')}
            >
                Delete Account
            </button>
        </div>
    );

    const ChangePassword = () => (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
            <form className="space-y-4">
                <input
                    type="password"
                    placeholder="Current Password"
                    className="block w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    className="block w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );

    const UpdateEmail = () => (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Update Email Address</h2>
            <form className="space-y-4">
                <input
                    type="email"
                    placeholder="New Email Address"
                    className="block w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );

    const DeleteAccount = () => (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Delete Account</h2>
            <p className="mb-4 text-red-600">
                Are you sure you want to delete your account? This action is irreversible.
            </p>
            <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => console.log('Account deleted')} // TODO: Add backend integration for account deletion
            >
                Confirm Delete
            </button>
            <button
                className="ml-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => handleSectionChange('AccountManagement')}
            >
                Cancel
            </button>
        </div>
    );

    const DataPrivacyRules = () => (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Data Privacy Rules</h2>
            <p>
                These are the privacy rules you agreed to during registration. Please review them carefully.
            </p>
            {/* Add the actual privacy rules here */}
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-white shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Settings</h2>
                <button
                    className={`block w-full text-left px-4 py-2 mb-2 rounded ${
                        activeSection === 'AccountPreferences' ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleSectionChange('AccountPreferences')}
                >
                    Account Preferences
                </button>
                <button
                    className={`block w-full text-left px-4 py-2 mb-2 rounded ${
                        activeSection === 'AccountManagement' ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleSectionChange('AccountManagement')}
                >
                    Account Management
                </button>
                <button
                    className={`block w-full text-left px-4 py-2 mb-2 rounded ${
                        activeSection === 'DataPrivacyRules' ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleSectionChange('DataPrivacyRules')}
                >
                    Data Privacy Rules
                </button>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-6">
                {activeSection === 'AccountPreferences' && <AccountPreferences />}
                {activeSection === 'UpdateProfile' && <UpdateProfile />}
                {activeSection === 'AccountManagement' && <AccountManagement />}
                {activeSection === 'ChangePassword' && <ChangePassword />}
                {activeSection === 'UpdateEmail' && <UpdateEmail />}
                {activeSection === 'DeleteAccount' && <DeleteAccount />}
                {activeSection === 'DataPrivacyRules' && <DataPrivacyRules />}
            </div>
        </div>
    );
};

export default SettingsPage;
