// src/components/ProductList.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosHelper from '../axiosHelper';

const ProductList = ({ productQuantities }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // Array of { product: {...}, quantity: number }
    const [imageURLs, setImageURLs] = useState({}); // Map of productId to image URL
    const imageURLsRef = useRef({}); // Ref to hold imageURLs for cleanup

    useEffect(() => {
        // Function to parse the product key string into an object
        const parseProductKey = (key) => {
            // Example key: "ProductForPostDto(productId=1, name=Milk, brand=İcim, imageURL=1736978232550_icim_main.png)"
            const regex = /ProductForPostDto\(productId=(\d+), name=([^,]+), brand=([^,]+), imageURL=([^)]+)\)/;
            const match = key.match(regex);
            if (match) {
                const productId = parseInt(match[1], 10);
                const name = match[2].trim();
                const brand = match[3].trim();
                const imageFilename = match[4].trim();
                return { productId, name, brand, imageFilename };
            }
            return null;
        };

        // Convert productQuantities to an array of { product, quantity }
        const parsedProducts = Object.entries(productQuantities).map(([key, quantity]) => {
            const product = parseProductKey(key);
            if (product) {
                return { product, quantity };
            }
            return null;
        }).filter(item => item !== null);

        setProducts(parsedProducts);
    }, [productQuantities]);

    useEffect(() => {
        const fetchImages = async () => {
            const newImageURLs = {};
            await Promise.all(products.map(async ({ product }) => {
                try {
                    const imageResponse = await axiosHelper(
                        `/products/getImage/${product.productId}`,
                        'GET',
                        null,
                        { responseType: 'blob' }
                    );
                    newImageURLs[product.productId] = URL.createObjectURL(imageResponse);
                } catch (error) {
                    console.error(`Error fetching image for product ID ${product.productId}:`, error);
                    // Do not set any image URL if fetching fails
                }
            }));
            setImageURLs(newImageURLs);
            imageURLsRef.current = newImageURLs;
        };

        if (products.length > 0) {
            fetchImages();
        }

        // Cleanup function to revoke object URLs to prevent memory leaks
        return () => {
            Object.values(imageURLsRef.current).forEach(url => URL.revokeObjectURL(url));
        };
    }, [products]); // Removed 'imageURLs' from dependencies

    if (!productQuantities || Object.keys(productQuantities).length === 0) {
        return (
            <div className="p-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Products</h3>
                <p className="text-gray-500">No products associated with this post.</p>
            </div>
        );
    }

    return (
        <div className="p-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(({ product, quantity }) => (
                    <div
                        key={product.productId}
                        className="flex items-center space-x-4 p-2 border rounded-md hover:shadow-md cursor-pointer"
                        onClick={() => navigate(`/product/${product.productId}`)}
                    >
                        {imageURLs[product.productId] ? (
                            <img
                                src={imageURLs[product.productId]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-full"
                                // No onError handler as per your requirement
                            />
                        ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                {/* Optionally, you can place an icon or leave it blank */}
                            </div>
                        )}
                        <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                            <p className="text-xs text-gray-500">Quantity: {quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
