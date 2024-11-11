import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const navigate = useNavigate();

    const handleReset = (e) => {
        e.preventDefault();
        // Here, you could add API call logic for password reset if needed.
        if (newPassword === repeatPassword) {
            navigate('/login'); // Redirect to LoginPage after resetting password
        } else {
            alert("Passwords don't match! Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0097b2] to-[#7ed957]">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Reset Password</h2>
                <form onSubmit={handleReset}>
                    <label className="block mb-4">
                        <span className="text-gray-700">New Password</span>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full p-3 border rounded-lg"
                            placeholder="Enter new password"
                            required
                        />
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">Repeat New Password</span>
                        <input
                            type="password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            className="mt-1 block w-full p-3 border rounded-lg"
                            placeholder="Repeat new password"
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Reset
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
