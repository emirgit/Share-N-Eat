import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const UploadSection = () => {
    const navigate = useNavigate();

    const handleUploadClick = () => {
        navigate('/upload');
    };

    return (
        <div 
            className="w-full flex items-center justify-center my-4 cursor-pointer"
            onClick={handleUploadClick}
        >
            <div className="w-full max-w-4xl bg-gray-100 p-8 rounded-lg shadow-md flex items-center justify-center">
                <FontAwesomeIcon icon={faPlus} className="text-gray-500 text-5xl" />
            </div>
        </div>
    );
};

export default UploadSection;
