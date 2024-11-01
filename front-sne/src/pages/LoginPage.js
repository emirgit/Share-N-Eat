import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Authentication logic can go here if needed
        console.log('Logging in with:', username, password);
        navigate('/'); // Redirect to MainPage on successful login
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-2xl font-semibold mb-6">Login</h1>
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
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
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                </label>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
