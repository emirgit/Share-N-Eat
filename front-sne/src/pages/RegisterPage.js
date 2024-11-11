import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Send a POST request to register the user
            await axios.post('http://localhost:8080/register', {
                username: username,
                email: email,
                password: password,
            });
            setError(''); // Clear any error messages
            navigate('/login'); // Redirect to LoginPage after successful registration
        } catch (err) {
            // Handle validation or server errors
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#0097b2] to-[#7ed957]">
            <h1 className="text-2xl font-semibold mb-6">Register</h1>
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <label className="block mb-4">
                    <span className="text-gray-700">Username</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                </label>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
