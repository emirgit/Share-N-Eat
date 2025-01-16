import React, { useState, useRef, useEffect } from 'react';
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

    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            selectedProducts.forEach(product => {
                if (product.imageUrl) {
                    URL.revokeObjectURL(product.imageUrl);
                }
            });
            if (image) {
                URL.revokeObjectURL(URL.createObjectURL(image));
            }
        };
    }, [selectedProducts, image]);

    const handleUploadClick = () => {
        setIsExpanded(true);
    };

    const handleCancel = () => {
        selectedProducts.forEach(product => {
            if (product.imageUrl) {
                URL.revokeObjectURL(product.imageUrl);
            }
        });
        if (image) {
            URL.revokeObjectURL(URL.createObjectURL(image));
        }

        setIsExpanded(false);
        setTitle('');
        setDescription('');
        setSelectedProducts([]);
        setImage(null);
    };

    const handleAddProduct = () => {
        setShowProductModal(true);
    };

    const handleAddIngredient = async (ingredient) => {
        try {
            const imageResponse = await axiosHelper(
                `/products/getImage/${ingredient.productId}`, 
                'GET', 
                null, 
                { responseType: 'blob' }
            );
            const imageUrl = URL.createObjectURL(imageResponse);

            const existing = selectedProducts.find(p => p.productId === ingredient.productId);
            if (existing) {
                setSelectedProducts(selectedProducts.map(p =>
                    p.productId === ingredient.productId
                        ? { ...p, quantity: p.quantity + ingredient.quantity }
                        : p
                ));
            } else {
                setSelectedProducts([...selectedProducts, { 
                    ...ingredient,
                    imageUrl: imageUrl 
                }]);
            }
            setShowProductModal(false);
        } catch (error) {
            console.error('Error fetching product image:', error);
            alert('Failed to load product image');
        }
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (image) {
                URL.revokeObjectURL(URL.createObjectURL(image));
            }
            setImage(selectedFile);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(prevProducts => {
            const productToRemove = prevProducts.find(p => p.productId === productId);
            if (productToRemove?.imageUrl) {
                URL.revokeObjectURL(productToRemove.imageUrl);
            }
            return prevProducts.filter(p => p.productId !== productId);
        });
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

        const formData = new FormData();
        formData.append('postName', title);
        formData.append('description', description);

        selectedProducts.forEach((product, index) => {
            formData.append(`productQuantities[${index}].productId`, product.productId);
            formData.append(`productQuantities[${index}].usedQuantity`, product.quantity);
        });

        formData.append('image', image);

        try {
            await axiosHelper('/posts', 'POST', formData, {
                'Content-Type': 'multipart/form-data',
            });

            alert('Post created successfully!');
            // Page refresh after success
            window.location.reload();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center w-full my-4 ">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-full">
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

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className="w-full overflow-x-auto py-4">
                                <div className="flex items-center space-x-4">
                                    {selectedProducts.map((product) => (
                                        <div
                                            key={product.productId}
                                            className="w-48 h-auto relative flex-shrink-0 border p-2 rounded-lg"
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/100';
                                                        console.error('Failed to load product image');
                                                    }}
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

                            <button
                                onClick={handleAddProduct}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
                            >
                                Add Product
                            </button>

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
