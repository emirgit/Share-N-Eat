import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/opng.png'; // Reusing the logo for design consistency

const VerifyEmail = () => {
    const [message, setMessage] = useState('Verifying your email, please wait...');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Memoized function to extract the token from URL parameters
    const getTokenFromURL = useCallback(() => {
        const params = new URLSearchParams(location.search);
        return params.get('token');
    }, [location.search]);

    useEffect(() => {
        const verifyEmail = async () => {
            const token = getTokenFromURL();

            if (!token) {
                setMessage('Invalid verification link.');
                setIsError(true);
                setTimeout(() => navigate('/auth/login'), 3000);
                return;
            }

            try {
                // Sends the verification request to the backend
                const response = await axios.get(`http://localhost:8080/auth/email/verify?token=${token}`);
                setMessage(response.data);  // Displays success message from the backend
                setIsError(false);
                setTimeout(() => navigate('/auth/login'), 3000);  // Redirects to login page after 3 seconds
            } catch (err) {
                // Handles different types of errors
                if (err.response && err.response.data) {
                    setMessage(err.response.data);  // Backend error message
                } else {
                    setMessage('An unexpected error occurred. Please try again later.');
                }
                setIsError(true);
                setTimeout(() => navigate('/auth/login'), 5000);  // Redirects after 5 seconds on error
            }
        };

        verifyEmail();
    }, [getTokenFromURL, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0097b2] to-[#7ed957]">
            <div className="flex items-center justify-between w-full max-w-5xl px-10">
                {/* Left Section with Logo */}
                <div className="flex-1 flex justify-start">
                    <img src={logo} alt="Share'N Eat Logo" className="w-2/3 max-w-sm -ml-6" />
                </div>

                {/* Right Section with Verification Status */}
                <div className="flex-1 max-w-md bg-white p-10 rounded-lg shadow-lg flex flex-col items-center">
                    <h1 className={`text-2xl font-bold mb-6 text-center ${isError ? 'text-red-600' : 'text-green-600'}`}>
                        {message}
                    </h1>
                    <p className="text-gray-500 text-sm text-center">
                        {isError
                            ? 'Redirecting to login page in a few seconds...'
                            : 'You will be redirected to the login page shortly.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
