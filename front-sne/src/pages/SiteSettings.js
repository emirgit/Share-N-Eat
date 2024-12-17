import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminMenu from '../components/AdminMenu';

const SiteSettings = () => {
    // State to manage settings
    const [termsOfService, setTermsOfService] = useState('These are the current Terms of Service...');
    const [privacyPolicy, setPrivacyPolicy] = useState('This is the current Privacy Policy...\nYour data is stored securely and is not shared without your consent.');

    const handleSave = () => {
        alert('Settings have been updated successfully!');
        // Replace with actual backend integration
        console.log('Terms of Service:', termsOfService);
        console.log('Privacy Policy:', privacyPolicy);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Admin Navbar */}
            <AdminNavbar />

            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-6">Site Settings</h1>

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
