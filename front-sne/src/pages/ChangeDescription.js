import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ChangeDescription = () => {
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit the new description to the backend
        console.log('New Description:', description);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-row w-full">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center p-8">
                    <h1 className="text-2xl font-semibold mb-6">Change Description</h1>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                        <label className="block mb-4">
                            <span className="text-gray-700">New Description</span>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter your new description"
                                className="mt-1 block w-full p-2 border rounded-md h-24 resize-none"
                            />
                        </label>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangeDescription;
