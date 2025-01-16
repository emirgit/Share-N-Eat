import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [token, setToken] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the token from the URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);

            // Validate the token by calling the back-end
            axios
                .get(`${process.env.REACT_APP_API_URL}/auth/reset/password?token=${tokenFromUrl}`)
                .then((response) => {
                    console.log(response.data); // Handle success (e.g., show reset form)
                })
                .catch((error) => {
                    console.error('Invalid or expired token:', error.response?.data);
                    setIsTokenValid(false); // Display an error message to the user
                });
        } else {
            setIsTokenValid(false); // No token in URL
        }
    }, [location]);

    const handleReset = (e) => {
        e.preventDefault();

        if (newPassword === repeatPassword) {
            // Send the new password and token to the back-end
            axios
                .post(`${process.env.REACT_APP_API_URL}/auth/reset/password`, {
                    token,
                    newPassword,
                })
                .then(() => {
                    alert('Password has been reset successfully.');
                    navigate('/auth/login'); // Redirect to login page
                })
                .catch((error) => {
                    console.error('Error resetting password:', error.response?.data);
                    alert('Failed to reset password. Please try again.');
                });
        } else {
            alert("Passwords don't match! Please try again.");
        }
    };

    if (!isTokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-2xl text-red-600">Invalid or expired token. Please try resetting your password again.</h2>
            </div>
        );
    }

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
