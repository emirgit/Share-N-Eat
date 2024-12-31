import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SettingsMenu from '../components/SettingsMenu';
import axiosHelper from '../axiosHelper'; // Ensure this path is correct
import '../styles/SettingsPage.css';

const SettingsPage = () => {
    const location = useLocation();
    const [selectedMenu, setSelectedMenu] = useState(
        location.state?.selectedMenu || 'Account Preferences'
    );

    // Account Preferences States
    const [currentEmail, setCurrentEmail] = useState('currentEmail@example.com'); // Mock current email
    const [email, setEmail] = useState('currentEmail@example.com'); // Form email state
    const [isVerifying, setIsVerifying] = useState(false); // State to show verification step
    const [password, setPassword] = useState(''); // State to capture password for verification

    // Add new states for location information
    const [currentCountry, setCurrentCountry] = useState('');
    const [currentCity, setCurrentCity] = useState('');
    const [currentRegion, setCurrentRegion] = useState('');
    const [currentPostalCode, setCurrentPostalCode] = useState('');
    const [currentAddress, setCurrentAddress] = useState('');

    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    // Data Privacy Rules States
    const [termsOfService, setTermsOfService] = useState('');
    const [privacyPolicy, setPrivacyPolicy] = useState('');
    const [loadingPrivacy, setLoadingPrivacy] = useState(true);
    const [errorPrivacy, setErrorPrivacy] = useState('');

    // Add new states for delete account verification
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    // Fetch site settings for Data Privacy Rules on component mount
    useEffect(() => {
        const fetchSiteSettings = async () => {
            try {
                const data = await axiosHelper('/settings'); // Endpoint: /api/settings
                setTermsOfService(data.termsOfService);
                setPrivacyPolicy(data.privacyPolicy);
                setLoadingPrivacy(false);
            } catch (error) {
                console.error('Error fetching site settings:', error);
                setErrorPrivacy('Failed to load site settings. Please try again later.');
                setLoadingPrivacy(false);
            }
        };

        fetchSiteSettings();
    }, []);

    const handleSaveChanges = () => {
        // Check if any changes were made
        if (email !== currentEmail ||
            country !== currentCountry ||
            city !== currentCity ||
            region !== currentRegion ||
            postalCode !== currentPostalCode ||
            address !== currentAddress) {
            setIsVerifying(true);
        } else {
            alert('No changes detected to save.');
        }
    };

    const handleVerifyPassword = () => {
        alert('Profile information updated successfully!');
        setCurrentEmail(email);
        setCurrentCountry(country);
        setCurrentCity(city);
        setCurrentRegion(region);
        setCurrentPostalCode(postalCode);
        setCurrentAddress(address);
        setIsVerifying(false);
    };

    const handleCancelVerification = () => {
        setEmail(currentEmail);
        setCountry(currentCountry);
        setCity(currentCity);
        setRegion(currentRegion);
        setPostalCode(currentPostalCode);
        setAddress(currentAddress);
        setIsVerifying(false);
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleDeleteAccount = () => {
        setIsDeleting(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // Using axiosHelper instead of fetch
            await axiosHelper('/user/delete/my-account', 'DELETE');
            
            // Clear storage and redirect on success
            localStorage.clear();
            sessionStorage.clear();
            alert('Account deleted successfully');
            navigate('/auth/login');
        } catch (error) {
            console.error('Delete error:', error);
            if (error.response?.status === 403) {
                alert('Access denied. Please check your password and try again.');
            } else {
                alert('An error occurred while trying to delete your account.');
            }
        }
    };

    const handleCancelDelete = () => {
        setIsDeleting(false);
        setDeletePassword('');
    };

    const handleDeleteOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancelDelete();
        }
    };

    // Add new function to handle modal close on overlay click
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancelVerification();
        }
    };

    const styles = {
        input: {
            transition: 'all 0.3s ease',
            ':hover': {
                borderColor: '#3b82f6'
            },
            ':focus': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
                outline: 'none'
            }
        },
        button: {
            transition: 'all 0.3s ease',
            ':hover': {
                transform: 'translateY(-1px)'
            }
        },
        modal: {
            animation: 'fadeIn 0.3s ease'
        },
        modalContent: {
            animation: 'slideIn 0.3s ease'
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-6 settings-title">Settings</h1>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        {selectedMenu === 'Account Preferences' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Update Profile Information</h2>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block mb-2 settings-label">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={currentEmail}
                                            className="settings-input w-full"
                                            style={styles.input}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 settings-label">Country</label>
                                        <input
                                            type="text"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            placeholder="Enter your country"
                                            className="settings-input w-full"
                                            style={styles.input}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 settings-label">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="Enter your city"
                                            className="settings-input w-full"
                                            style={styles.input}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 settings-label">Region</label>
                                        <input
                                            type="text"
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            placeholder="Enter your region"
                                            className="settings-input w-full"
                                            style={styles.input}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 settings-label">Postal Code</label>
                                        <input
                                            type="number"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            placeholder="Enter your postal code"
                                            className="settings-input w-full"
                                            style={styles.input}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 settings-label">Full Address</label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter your full address"
                                            className="settings-input w-full"
                                            style={styles.input}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSaveChanges}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                        style={styles.button}
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}
                        {selectedMenu === 'Account Management' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Manage Account</h2>
                                <div className="space-y-4">
                                    <button
                                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                        onClick={handleChangePassword}
                                        style={styles.button}
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                        onClick={handleDeleteAccount}
                                        style={styles.button}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                        {selectedMenu === 'Data Privacy Rules' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Data Privacy Rules</h2>
                                {loadingPrivacy ? (
                                    <p className="text-gray-700">Loading data privacy rules...</p>
                                ) : errorPrivacy ? (
                                    <p className="text-red-500">{errorPrivacy}</p>
                                ) : (
                                    <div>
                                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                            <h3 className="text-lg font-semibold mb-2">Terms of Service:</h3>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {termsOfService}
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                            <h3 className="text-lg font-semibold mb-2">Privacy Policy:</h3>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {privacyPolicy}
                                            </p>
                                        </div>
                                    </div>
                                )}
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

            {/* Add Modal */}
            {isVerifying && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 verify-modal verify-modal-overlay"
                    onClick={handleOverlayClick}
                    style={styles.modal}

                >
                    <div className="verify-modal-content p-6 w-96">
                        <h3 className="verify-modal-title text-xl mb-4">Verify Changes</h3>
                        <p className="settings-subtitle mb-4">
                            Please enter your password to verify the changes.
                        </p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="verify-modal-input w-full p-2 rounded-lg mb-4"
                            style={styles.input}
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={handleVerifyPassword}
                                className="verify-modal-button flex-1 bg-green-500 text-white px-4 py-2 rounded-lg"
                                style={styles.button}
                            >
                                Verify and Save
                            </button>
                            <button
                                onClick={handleCancelVerification}
                                className="verify-modal-button flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg"
                                style={styles.button}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {isDeleting && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 delete-modal delete-modal-overlay"
                    onClick={handleDeleteOverlayClick}
                    style={styles.modal}
                >
                    <div className="delete-modal-content p-6 w-96">
                        <h3 className="delete-modal-title text-xl mb-4">Delete Account</h3>
                        <p className="settings-subtitle mb-4 text-red-600">
                            Warning: This action cannot be undone. All your data will be permanently deleted.
                        </p>
                        <p className="settings-subtitle mb-4">
                            Please enter your password to confirm deletion.
                        </p>
                        <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                            className="delete-modal-input w-full p-2 rounded-lg mb-4"
                            style={styles.input}
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={handleConfirmDelete}
                                className="delete-modal-button flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                style={styles.button}
                            >
                                Delete Account
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="delete-modal-button flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                style={styles.button}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
