import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const UploadSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleUploadClick = () => {
        setIsExpanded(true);
    };

    const handleCancel = () => {
        setIsExpanded(false);
        setTitle(''); // Clear input fields
        setDescription('');
        setImage(null);
    };

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <div className="flex items-center justify-center w-full my-4">
            {/* Collapsed Version */}
            {!isExpanded && (
                <div
                    className="transition-all duration-300 ease-in-out w-full max-w-4xl bg-gray-100 p-8 rounded-lg shadow-md cursor-pointer"
                    onClick={handleUploadClick}
                >
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faPlus} className="text-gray-500 text-5xl" />
                    </div>
                </div>
            )}

            {/* Modal Overlay */}
            {isExpanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                        {/* Modal Content */}
                        <div className="flex flex-col items-center">
                            <h2 className="text-lg font-semibold mb-4">Create a New Post</h2>
                            <input
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 mb-3 border rounded-md"
                            />
                            <textarea
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 mb-3 border rounded-md"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mb-3"
                            />
                            {image && (
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-md mb-3"
                                />
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end w-full space-x-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadSection;
