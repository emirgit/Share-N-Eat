import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true); // Start loading
        try {
            // Send a POST request to register the user
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
                username,
                email,
                password,
            });
            setSuccess(response.data); // Display success message

            // Optionally, navigate to the login page after a short delay
            setTimeout(() => {
                navigate('/auth/login');
            }, 5000); // Redirects after 5 seconds
        } catch (err) {
            if (err.response) {
                if (err.response.status === 409) {
                    // Specific message for 409 Conflict
                    setError('Username or email is already in use. If you already have an account, please check your email to verify it.');
                } else {
                    // Use the message from the server for other error statuses
                    setError(err.response.data || 'Registration failed. Please try again.');
                }
            } else {
                // If the error is due to network issues or other reasons
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#0097b2] to-[#7ed957]">
            <h1 className="text-2xl font-semibold mb-6">Register</h1>
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                {success && <div className="text-green-500 mb-4">{success}</div>}
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <label className="block mb-4">
                    <span className="text-gray-700">Username</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading} // Disable during loading
                        className="mt-1 block w-full p-2 border rounded-md"
                        placeholder="Enter your username"
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading} // Disable during loading
                        className="mt-1 block w-full p-2 border rounded-md"
                        placeholder="Enter your email address"
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading} // Disable during loading
                        className="mt-1 block w-full p-2 border rounded-md"
                        placeholder="Enter your password"
                    />
                </label>
                <button
                    type="submit"
                    disabled={loading} // Disable during loading
                    className={`bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition-colors flex items-center justify-center ${
                        loading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            Registering...
                        </>
                    ) : (
                        'Register'
                    )}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
