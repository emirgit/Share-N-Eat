import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const UploadPage = () => {
    const [photos, setPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([]);

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + photos.length > 5) {
            alert("You can upload a maximum of 5 photos.");
            return;
        }
        setPhotos([...photos, ...files]);
    };

    // Handle adding new ingredient
    const addIngredient = () => {
        setIngredients([...ingredients, ""]);
    };

    // Handle ingredient change
    const handleIngredientChange = (index, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = value;
        setIngredients(updatedIngredients);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-row w-full">
                {/* Sidebar */}
                <Sidebar />

                {/* Upload Form */}
                <div className="flex-1 flex flex-col items-center p-8">
                    <h1 className="text-2xl font-semibold mb-6">Upload Your Recipe</h1>

                    {/* Photo Upload Section */}
                    <div className="w-full max-w-3xl mb-6">
                        <h2 className="text-lg font-medium mb-2">Photos (max 5, first is thumbnail)</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Uploaded photos preview */}
                            {photos.map((photo, index) => (
                                <div 
                                    key={index} 
                                    className={`w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center ${
                                        index === 0 ? "border-4 border-blue-500" : "border"
                                    }`}
                                >
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt={`Recipe ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            ))}

                            {/* Upload button for adding more photos */}
                            {photos.length < 5 && (
                                <label className="w-32 h-32 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg cursor-pointer border-2 border-dashed">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handlePhotoUpload}
                                    />
                                    <span className="text-xl">+</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="w-full max-w-3xl mb-6">
                        <h2 className="text-lg font-medium mb-2">Description</h2>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your recipe here..."
                            className="w-full h-32 p-4 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* Ingredients Section */}
                    <div className="w-full max-w-3xl">
                        <h2 className="text-lg font-medium mb-2">Ingredients</h2>
                        {ingredients.map((ingredient, index) => (
                            <input
                                key={index}
                                type="text"
                                value={ingredient}
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                placeholder={`Ingredient ${index + 1}`}
                                className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
                            />
                        ))}
                        <button
                            onClick={addIngredient}
                            className="mt-2 text-blue-500"
                        >
                            + Add Ingredient
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
