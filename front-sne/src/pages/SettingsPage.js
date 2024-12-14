import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SettingsMenu from '../components/SettingsMenu';

const SettingsPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('Account Preferences');
    const [currentUsername, setCurrentUsername] = useState('currentUsername'); // Mock current username
    const [currentEmail, setCurrentEmail] = useState('currentEmail@example.com'); // Mock current email
    const [currentBio, setCurrentBio] = useState('This is my biography.'); // Mock current bio
    const [username, setUsername] = useState('currentUsername'); // Form username state
    const [email, setEmail] = useState('currentEmail@example.com'); // Form email state
    const [bio, setBio] = useState('This is my biography.'); // Form bio state
    const [isVerifying, setIsVerifying] = useState(false); // State to show verification step
    const [password, setPassword] = useState(''); // State to capture password for verification

    const navigate = useNavigate();

    const handleSaveChanges = () => {
        // Check if any changes were made
        if (username !== currentUsername || email !== currentEmail || bio !== currentBio) {
            setIsVerifying(true); // Show the password verification step
        } else {
            alert('No changes detected to save.');
        }
    };

    const handleVerifyPassword = () => {
        alert('Profile information updated successfully!');
        // Update current username, email, and bio to the new values
        setCurrentUsername(username);
        setCurrentEmail(email);
        setCurrentBio(bio);
        setIsVerifying(false);
    };

    const handleCancelVerification = () => {
        // Reset form values to current values if verification is canceled
        setUsername(currentUsername);
        setEmail(currentEmail);
        setBio(currentBio);
        setIsVerifying(false);
    };

    const handleChangePassword = () => {
        navigate('/auth/reset/password');
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action is irreversible, and all your data will be permanently deleted.'
        );
        if (confirmed) {
            // Logic to delete the account goes here
            alert('Your account has been successfully deleted.');
            navigate('/login'); // Redirect to login page after deletion
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar />

            <div className="flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-6">Settings</h1>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        {selectedMenu === 'Account Preferences' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Update Profile Information</h2>
                                {isVerifying ? (
                                    <div className="space-y-4">
                                        <p className="text-gray-700">
                                            Please enter your password to verify the changes.
                                        </p>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={handleVerifyPassword}
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                            >
                                                Verify and Save Changes
                                            </button>
                                            <button
                                                onClick={handleCancelVerification}
                                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block font-medium text-gray-600 mb-2">Username</label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder={currentUsername}
                                                className="w-full p-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-600 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={currentEmail}
                                                className="w-full p-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-600 mb-2">Biography</label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder={currentBio}
                                                className="w-full p-2 border rounded-lg"
                                                rows={3}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSaveChanges}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                        {selectedMenu === 'Account Management' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Manage Account</h2>
                                <div className="space-y-4">
                                    <button
                                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                        onClick={handleChangePassword}
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                        onClick={handleDeleteAccount}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                        {selectedMenu === 'Data Privacy Rules' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Data Privacy Rules</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    These are the data privacy rules you accepted during registration. Make sure to 
                                    review them periodically to understand how your data is used and stored. 
                                </p>
                                <ul className="list-disc ml-8 mt-4 text-gray-700">
                                    <li>Your data is stored securely and is not shared without your consent.</li>
                                    <li>You can request data deletion anytime.</li>
                                    <li>Only authorized personnel have access to your data.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings Menu */}
                <SettingsMenu
                    selectedMenu={selectedMenu}
                    setSelectedMenu={setSelectedMenu}
                />
            </div>
        </div>
    );
};

export default SettingsPage;





