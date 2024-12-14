import React, { useState } from 'react';

const ProductUpload = () => {
    const [isActive, setIsActive] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        proteinGrams: 0,
        carbonhydratesGrams: 0,
        fatGrams: 0,
        quantity: '',
        calories: 0,
        contents: '',
        thumbnail: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleThumbnailChange = (e) => {
        setFormData((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting product:', formData);
        // Add API call logic here
        setIsActive(false); // Collapse after submission
    };

    return (
        <div
            className={`transition-all duration-300 ${
                isActive ? 'bg-white shadow-md p-4' : 'bg-gray-200'
            } rounded-2xl`}
            style={{
                height: isActive ? 'auto' : '48px',
                cursor: isActive ? 'default' : 'pointer',
                width: '100%', // Full-width design for both active and inactive states
            }}
            onClick={() => !isActive && setIsActive(true)}
        >
            {/* Inactive State */}
            {!isActive ? (
                <div className="flex items-center justify-center h-full">
                    <span className="text-gray-600 font-semibold">Add Product</span>
                </div>
            ) : (
                // Active State
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Product Name */}
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g., Milk"
                                value={formData.name}
                                onChange={handleChange}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                        {/* Quantity */}
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Quantity</label>
                            <input
                                type="text"
                                name="quantity"
                                placeholder="e.g., 500ml"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                        {/* Calories */}
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">kcal</label>
                            <input
                                type="number"
                                name="calories"
                                placeholder="Calories"
                                value={formData.calories}
                                onChange={handleChange}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                        {/* Contents */}
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Contents</label>
                            <input
                                type="text"
                                name="contents"
                                placeholder="e.g., Lactose-free, skimmed milk"
                                value={formData.contents}
                                onChange={handleChange}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                    </div>

                    {/* Macronutrients */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Protein (g)</label>
                            <input
                                type="number"
                                name="protein"
                                placeholder="Protein"
                                value={formData.proteinGrams}
                                onChange={handleChange}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Carbs (g)</label>
                            <input
                                type="number"
                                name="carbs"
                                placeholder="Carbs"
                                value={formData.carbonhydratesGrams}
                                onChange={handleChange}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Fat (g)</label>
                            <input
                                type="number"
                                name="fat"
                                placeholder="Fat"
                                value={formData.fatGrams}
                                onChange={handleChange}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="border p-2 rounded w-full text-sm"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setIsActive(false)}
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded text-sm"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProductUpload;
