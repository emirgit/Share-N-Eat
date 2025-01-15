import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCamera } from '@fortawesome/free-solid-svg-icons';
import axiosHelper from '../axiosHelper';
import IngredientAdd from './IngredientAdd';

const UploadSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [image, setImage] = useState(null);

    const fileInputRef = useRef(null); // Reference to the hidden file input

    const handleUploadClick = () => {
        setIsExpanded(true);
    };

    const handleCancel = () => {
        setIsExpanded(false);
        setTitle('');
        setDescription('');
        setSelectedProducts([]);
        setImage(null);
    };

    const handleAddProduct = () => {
        setShowProductModal(true);
    };

    const handleAddIngredient = (ingredient) => {
        // Check if the product is already selected
        const existing = selectedProducts.find(p => p.productId === ingredient.productId);
        if (existing) {
            // Update the quantity
            setSelectedProducts(selectedProducts.map(p =>
                p.productId === ingredient.productId
                    ? { ...p, quantity: p.quantity + ingredient.quantity }
                    : p
            ));
        } else {
            // Add new product
            setSelectedProducts([...selectedProducts, { ...ingredient }]);
        }
        setShowProductModal(false);
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImage(selectedFile);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click(); // Trigger the hidden file input
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setSelectedProducts(selectedProducts.map(p =>
            p.productId === productId
                ? { ...p, quantity: newQuantity }
                : p
        ));
    };

    const handleSubmit = async () => {
        if (selectedProducts.length === 0) {
            alert('Please add at least one product!');
            return;
        }

        if (!image) {
            alert('Please upload an image!');
            return;
        }

        const postRequest = {
            postName: title,
            description: description,
            productQuantities: selectedProducts.map(p => ({
                productId: p.productId,
                usedQuantity: p.quantity,
            })),
        };

        const formData = new FormData();
        formData.append('postRequest', JSON.stringify(postRequest));
        formData.append('image', image);

        try {
            await axiosHelper('/posts', 'POST', formData, {
                'Content-Type': 'multipart/form-data',
            });

            alert('Post created successfully!');
            handleCancel();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center w-full my-4">
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

            {isExpanded && (
                <div className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-full">
                        <div className="flex flex-col items-center">
                            <h2 className="text-lg font-semibold mb-4">Create a New Post</h2>

                            {/* Title Input */}
                            <input
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 mb-3 border rounded-md"
                            />

                            {/* Description Input */}
                            <textarea
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 mb-3 border rounded-md"
                            ></textarea>

                            {/* Clickable Image Upload Area */}
                            <div
                                className="w-40 h-40 mb-4 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer relative hover:border-blue-500"
                                onClick={handleImageClick}
                            >
                                {image ? (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faCamera} className="text-gray-400 text-3xl" />
                                )}

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* Scrollable Selected Products Section */}
                            <div className="w-full overflow-x-auto py-4">
                                <div className="flex items-center space-x-4">
                                    {selectedProducts.map((product) => (
                                        <div
                                            key={product.productId}
                                            className="w-48 h-auto relative flex-shrink-0 border p-2 rounded-lg"
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={`https://via.placeholder.com/100`} // Placeholder, you might want to fetch actual images or pass them from IngredientAdd
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium">{product.name}</h3>
                                                    <p className="text-xs text-gray-600">{product.brand}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveProduct(product.productId)}
                                                    className="text-red-500 text-lg"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                            <div className="mt-2">
                                                <label className="text-xs">Quantity (g/ml):</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={product.quantity}
                                                    onChange={(e) => handleQuantityChange(product.productId, Number(e.target.value))}
                                                    className="w-full p-1 border rounded-md text-xs"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add Product Button */}
                            <button
                                onClick={handleAddProduct}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
                            >
                                Add Product
                            </button>

                            {/* Action Buttons */}
                            <div className="flex justify-end w-full space-x-4 mt-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {showProductModal && (
                <IngredientAdd
                    onAddIngredient={handleAddIngredient}
                    onCancel={() => setShowProductModal(false)}
                />
            )}
        </div>
    );
};

export default UploadSection;
