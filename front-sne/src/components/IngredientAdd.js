import React, { useState, useEffect } from 'react';
import axiosHelper from '../axiosHelper';

const IngredientAdd = ({ onAddIngredient, onCancel }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const allProducts = await axiosHelper('/products/getAll', 'GET');
            const productsWithImages = await Promise.all(
                allProducts.map(async (product) => {
                    const imageResponse = await axiosHelper(`/products/getImage/${product.id}`, 'GET', null, { responseType: 'blob' });
                    const imageUrl = URL.createObjectURL(imageResponse);
                    return { ...product, imageUrl };
                })
            );
            setAvailableProducts(productsWithImages);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            fetchProducts();
            return;
        }
        setLoading(true);
        setError('');
        try {
            const searchedProducts = await axiosHelper(`/products/search?keyword=${encodeURIComponent(searchKeyword)}`, 'GET');
            const productsWithImages = await Promise.all(
                searchedProducts.map(async (product) => {
                    const imageResponse = await axiosHelper(`/products/getImage/${product.id}`, 'GET', null, { responseType: 'blob' });
                    const imageUrl = URL.createObjectURL(imageResponse);
                    return { ...product, imageUrl };
                })
            );
            setAvailableProducts(productsWithImages);
        } catch (error) {
            console.error('Failed to search products:', error);
            setError('Failed to search products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
    };

    const handleAdd = () => {
        if (!selectedProduct) {
            alert('Please select a product.');
            return;
        }
        if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }
        const ingredient = {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            quantity: Number(quantity),
        };
        onAddIngredient(ingredient);
        // Reset selections
        setSelectedProduct(null);
        setQuantity('');
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <h2 className="text-lg font-semibold mb-4">Add Product</h2>
                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="flex-1 p-2 border rounded-l-md"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                    >
                        Search
                    </button>
                </div>

                {loading && <p>Loading products...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="flex space-x-4 overflow-x-auto py-4">
                    {availableProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`w-40 p-2 border rounded-md cursor-pointer ${
                                selectedProduct && selectedProduct.id === product.id
                                    ? 'border-blue-500'
                                    : 'border-gray-300'
                            }`}
                            onClick={() => handleSelectProduct(product)}
                        >
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-24 object-cover rounded-md"
                            />
                            <h3 className="mt-2 text-sm font-medium">{product.name}</h3>
                            <p className="text-xs text-gray-600">{product.brand}</p>
                        </div>
                    ))}
                </div>

                {selectedProduct && (
                    <div className="mt-4">
                        <label className="block mb-2">Quantity (g/ml):</label>
                        <input
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IngredientAdd;
