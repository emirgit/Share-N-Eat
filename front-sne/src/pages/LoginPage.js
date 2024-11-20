import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/opng.png'; // Import your logo image here

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email: email,
                password: password,
            });
            localStorage.setItem('token', response.data.jwt);
            console.log('Jwt:',localStorage.getItem('token')); 
            setError('');
            navigate('/'); // Redirect to MainPage on successful login
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0097b2] to-[#7ed957]">
            <div className="flex items-center justify-between w-full max-w-5xl px-10">
                {/* Left Section with Logo */}
                <div className="flex-1 flex justify-start">
                    <img src={logo} alt="Share'N Eat Logo" className="w-2/3 max-w-sm -ml-6" /> {/* Increased logo size */}
                </div>

                {/* Right Section with Login Form */}
                <div className="flex-1 max-w-md bg-white p-10 rounded-lg shadow-lg flex flex-col items-center">
                    {/* Header Text */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Connect to the community and start to Share'N Eat!
                    </h1>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="w-full">
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <label className="block mb-4">
                            <span className="text-gray-700">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full p-3 border rounded-lg"
                                placeholder="Enter your email"
                            />
                        </label>
                        <label className="block mb-4">
                            <span className="text-gray-700">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full p-3 border rounded-lg"
                                placeholder="Enter your password"
                            />
                        </label>

                        {/* Forget Password and Register Links */}
                        <div className="flex justify-between text-sm text-blue-500 mb-4">
                            <span 
                                onClick={() => navigate('/auth/forgot/password')} 
                                className="cursor-pointer hover:underline"
                            >
                                Forget Password?
                            </span>
                            <span 
                                onClick={() => navigate('/auth/register')} 
                                className="cursor-pointer hover:underline"
                            >
                                Don't have an account?
                            </span>
                        </div>

                        {/* Login Button */}
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
