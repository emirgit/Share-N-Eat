import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ChangePhoto = () => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setSelectedPhoto(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit the new photo to the backend
        console.log('New Photo:', selectedPhoto);
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
                    <h1 className="text-2xl font-semibold mb-6">Change Profile Photo</h1>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md flex flex-col items-center">
                        <div className="w-full h-48 bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                            {selectedPhoto ? (
                                <img src={selectedPhoto} alt="New Profile" className="object-cover w-full h-full rounded-lg" />
                            ) : (
                                <span className="text-gray-500">Upload a new profile photo</span>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="mb-4" />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePhoto;
