import React, { useState } from 'react';
import axiosHelper from "../axiosHelper";
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { categories } from './CategoriesSection';

const ProductUpload = () => {
    const [isActive, setIsActive] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        images: [null, null, null], // Array for 3 images
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    // const handleThumbnailChange = (e) => {
    //     setFormData((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
    // };

    const handleImageChange = (index, file) => {
        setFormData((prev) => {
            const updatedImages = [...prev.images];
            updatedImages[index] = file;
            return { ...prev, images: updatedImages };
        });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const data = new FormData();
    //     data.append('name', formData.name);
    //     data.append('proteinGrams', formData.proteinGrams);
    //     data.append('carbonhydrateGrams', formData.carbonhydrateGrams);
    //     data.append('fatGrams', formData.fatGrams);
    //     data.append('quantity', formData.quantity);
    //     data.append('calories', formData.calories);
    //     data.append('content', formData.contents);
    //     if (formData.thumbnail) {
    //         data.append('file', formData.thumbnail);
    //     }

    //     try {
    //         const response = await axiosHelper('/products', 'POST', data, {
    //             'Content-Type': 'multipart/form-data',
    //         });
    //         console.log('Product uploaded successfully:', response);
    //         setIsActive(false); // Collapse after submission
    //     } catch (error) {
    //         console.error('Error uploading product:', error);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('brand', formData.brand);
        data.append('category', formData.category);

        formData.images.forEach((image, index) => {
            if (image) data.append(`image${index + 1}`, image); // Add images to FormData
        });

        try {
            const response = await axiosHelper('/products/product-request', 'POST', data, {
                'Content-Type': 'multipart/form-data',
            });
            console.log('Product uploaded successfully:', response);
            setIsActive(false); // Collapse after submission
        } catch (error) {
            console.error('Error uploading product:', error);
        }
    };

    /*
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('proteinGrams', formData.proteinGrams);
        data.append('carbonhydratesGrams', formData.carbonhydratesGrams);
        data.append('fatGrams', formData.fatGrams);
        data.append('quantity', formData.quantity);
        data.append('calories', formData.calories);
        data.append('contents', formData.contents);
        if (formData.thumbnail) {
            data.append('files', formData.thumbnail);
        }

        try {
            const response = await axiosHelper('/products/product-request', 'POST', data, {
                'Content-Type': 'multipart/form-data',
            });
            console.log('Product uploaded successfully:', response);
            setIsActive(false); // Collapse after submission
        } catch (error) {
            console.error('Error uploading product:', error);
        }
    };*/

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
            {!isActive ? (
                <div className="flex items-center justify-center h-full">
                    <span className="text-gray-600 font-semibold">Add Product</span>
                </div>
            ) : (
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
                        {/* Brand */}
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                placeholder="e.g., DairyBest"
                                value={formData.brand}
                                onChange={handleChange}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                    </div>
                    
                    {/* Category Selection */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="border p-2 rounded w-full text-sm"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Upload Images */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Upload 3 Images</label>
                        <div className="flex space-x-4">
                            {formData.images.map((image, index) => (
                                <label
                                    key={index}
                                    className="flex items-center justify-center border border-gray-300 w-24 h-24 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer relative"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                                    />
                                    {image ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Uploaded ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faCamera}
                                            className="text-gray-400 text-2xl"
                                        />
                                    )}
                                </label>
                            ))}
                        </div>
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