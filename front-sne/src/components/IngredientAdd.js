import React, { useState, useEffect, useCallback, useRef } from 'react';
import axiosHelper from '../axiosHelper';

const IngredientAdd = ({ onAddIngredient, onCancel }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [imageURLs, setImageURLs] = useState({});

    // Use a ref to hold imageURLs for cleanup to avoid re-creating the cleanup function
    const imageURLsRef = useRef(imageURLs);
    imageURLsRef.current = imageURLs;

    // Cleanup function
    const cleanupImageURLs = useCallback(() => {
        Object.values(imageURLsRef.current).forEach(url => URL.revokeObjectURL(url));
    }, []);

    const fetchAndSetProducts = useCallback(async (products) => {
        if (!Array.isArray(products)) {
            products = products.content || [];
        }

        const newImageURLs = {};
        for (const product of products) {
            try {
                const imageResponse = await axiosHelper(
                    `/products/getImage/${product.id}`,
                    'GET',
                    null,
                    { responseType: 'blob' }
                );
                newImageURLs[product.id] = URL.createObjectURL(imageResponse);
            } catch (error) {
                console.error(`Failed to fetch image for product ${product.id}:`, error);
            }
        }

        setImageURLs(prev => {
            // Cleanup old URLs that aren't in the new results
            Object.entries(prev).forEach(([id, url]) => {
                if (!newImageURLs[id]) {
                    URL.revokeObjectURL(url);
                }
            });
            return newImageURLs;
        });

        setSearchResults(products);
    }, []);

    const fetchInitialProducts = useCallback(async () => {
        setLoading(true);
        try {
            const products = await axiosHelper('/products/getAll', 'GET');
            await fetchAndSetProducts(products);
        } catch (error) {
            console.error('Failed to fetch initial products:', error);
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    }, [fetchAndSetProducts]);

    // Initial load of products
    useEffect(() => {
        fetchInitialProducts();
    }, [fetchInitialProducts]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupImageURLs();
        };
    }, [cleanupImageURLs]);

    const performSearch = useCallback(async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await axiosHelper(
                `/products/search?keyword=${encodeURIComponent(searchQuery)}`,
                'GET'
            );
            await fetchAndSetProducts(response);
        } catch (error) {
            console.error('Search failed:', error);
            setError('Failed to search products.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, fetchAndSetProducts]);

    // Debounced search effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery) {
                performSearch();
            } else {
                fetchInitialProducts();
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, performSearch, fetchInitialProducts]);

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
            brand: selectedProduct.brand,
            quantity: Number(quantity),
            imageUrl: imageURLs[selectedProduct.id]
        };

        onAddIngredient(ingredient);
        setSelectedProduct(null);
        setQuantity('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <h2 className="text-lg font-semibold mb-4">Add Product</h2>
                
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                />

                {/* Loading and Error States */}
                {loading && <p className="text-gray-500">Loading products...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                        <div
                            key={product.id}
                            className={`p-2 border rounded-md cursor-pointer transition-all ${
                                selectedProduct?.id === product.id
                                    ? 'border-blue-500 shadow-md'
                                    : 'border-gray-300 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedProduct(product)}
                        >
                            <img
                                src={imageURLs[product.id]}
                                alt={product.name}
                                className="w-full h-24 object-cover rounded-md mb-2"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/100';
                                }}
                            />
                            <h3 className="text-sm font-medium truncate">{product.name}</h3>
                            <p className="text-xs text-gray-600 truncate">{product.brand}</p>
                        </div>
                    ))}
                </div>

                {/* Quantity Input */}
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

                {/* Action Buttons */}
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
