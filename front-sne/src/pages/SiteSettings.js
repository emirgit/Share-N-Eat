import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminMenu from '../components/AdminMenu';
import axiosHelper from '../axiosHelper';

const SiteSettings = () => {
    // State to manage settings
    const [termsOfService, setTermsOfService] = useState('');
    const [privacyPolicy, setPrivacyPolicy] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch current settings on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await axiosHelper('/settings');
                setTermsOfService(data.termsOfService);
                setPrivacyPolicy(data.privacyPolicy);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching settings:', err);
                setError('Failed to load settings. Please try again later.');
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Handle save button click
    const handleSave = async () => {
        try {
            const payload = {
                termsOfService,
                privacyPolicy,
            };
            const updatedData = await axiosHelper('/settings', 'PUT', payload);
            setSuccessMessage('Settings have been updated successfully!');
            setError('');
            // Optionally, you can log the updated settings
            console.log('Updated Terms of Service:', updatedData.termsOfService);
            console.log('Updated Privacy Policy:', updatedData.privacyPolicy);
        } catch (err) {
            console.error('Error updating settings:', err);
            setError('Failed to update settings. Please try again.');
            setSuccessMessage('');
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-100">
                <AdminNavbar />
                <div className="flex">
                    <div className="flex-1 p-8 flex items-center justify-center">
                        <p className="text-xl">Loading...</p>
                    </div>
                    <AdminMenu />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Admin Navbar */}
            <AdminNavbar />

            <div className="flex flex-1">
                {/* Main Content */}
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-6">Site Settings</h1>

                    {/* Display Success Message */}
                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}

                    {/* Display Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Terms of Service */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Terms of Service</h2>
                        <textarea
                            value={termsOfService}
                            onChange={(e) => setTermsOfService(e.target.value)}
                            className="w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Privacy Policy */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
                        <textarea
                            value={privacyPolicy}
                            onChange={(e) => setPrivacyPolicy(e.target.value)}
                            className="w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>

                {/* Admin Menu */}
                <AdminMenu />
            </div>
        </div>
    );
};

export default SiteSettings;
