import React, { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        alert("Please wait response to come...")
        try {
            const response = await fetch(`http://localhost:8080/auth/forgot/password/${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Check if the response is successful
            if (response.ok) {
                // Extract the response as plain text
                const data = await response.text();
                alert(data); // Display the response message
            } else {
                // Extract the error message as plain text
                const errorData = await response.text();
                alert(errorData); // Show error message
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0097b2] to-[#7ed957]">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Verify Email</h2>
                <form onSubmit={handleVerify}>
                    <label className="block mb-4">
                        <span className="text-gray-700">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full p-3 border rounded-lg"
                            placeholder="Enter your email"
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
