import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosHelper from '../axiosHelper';
import '../styles/SettingsPage.css';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }

        try {
            // Use axiosHelper with the data in the request body
            const params = new URLSearchParams({
                currentPassword: currentPassword,
                newPassword: newPassword,
                newPasswordtoConfirm: confirmPassword
            });

            await axiosHelper(`/user/change-password/my-account?${params}`, 'PUT');

            alert('Password changed successfully!');
            navigate('/settings', { state: { selectedMenu: 'Account Management' } });
        } catch (error) {
            console.error('Password change error:', {
                status: error.response?.status,
                message: error.response?.data
            });
            
            if (error.response?.status === 403) {
                alert('Current password is incorrect. Please try again.');
            } else {
                alert('Failed to change password. Please try again.');
            }
        }
    };

    return (
        <div className="change-password-container flex items-center justify-center">
            <div className="change-password-form p-8 w-full max-w-md mx-4">
                <h2 className="settings-title text-2xl font-semibold mb-6 text-center">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="settings-label block mb-2">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="change-password-input w-full"
                            placeholder="Enter current password"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="settings-label block mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="change-password-input w-full"
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    <div>
                        <label className="settings-label block mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="change-password-input w-full"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="change-password-button w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
                    >
                        Change Password
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/settings', { state: { selectedMenu: 'Account Management' } })}
                        className="change-password-button w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;