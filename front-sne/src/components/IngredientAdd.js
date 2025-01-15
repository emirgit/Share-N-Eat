import React, { useState } from 'react';

const IngredientAdd = ({ existingProducts, onAddIngredient, onCancel }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    const handleAddIngredient = () => {
        if (selectedProduct && quantity) {
            onAddIngredient({ ...selectedProduct, quantity });
            setSelectedProduct(null);
            setQuantity('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
                <h3 className="text-lg font-semibold mb-4">Select a Product</h3>

                {/* Product List */}
                <div className="grid grid-cols-3 gap-4">
                    {existingProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductSelect(product)}
                            className={`cursor-pointer p-2 border rounded-lg ${
                                selectedProduct?.id === product.id
                                    ? 'border-blue-500'
                                    : 'border-gray-300'
                            }`}
                        >
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-20 object-cover rounded-lg"
                            />
                            <p className="text-center mt-2 text-sm">{product.name}</p>
                        </div>
                    ))}
                </div>

                {/* Quantity Input */}
                <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">Enter Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddIngredient}
                        disabled={!selectedProduct || !quantity}
                        className={`px-4 py-2 rounded-md ${
                            selectedProduct && quantity
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Add Ingredient
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IngredientAdd;
