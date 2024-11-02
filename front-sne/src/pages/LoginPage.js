import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/login', {
                email: email,
                password: password,
            });
            // Store the JWT token in local storage or cookies
            localStorage.setItem('token', response.data.jwt);
            setError('');
            console.log('Logging in with:', email, password); // Moved inside try block
            navigate('/'); // Redirect to MainPage on successful login
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-2xl font-semibold mb-6">Login</h1>
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <label className="block mb-4">
                    <span className="text-gray-700">Email</span>
                    <input
                        type="text"
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
                {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
