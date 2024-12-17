import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import axiosHelper from '../axiosHelper';

const ProductDetailsPage = () => {
    const { productId } = useParams(); // Extract productId from URL
    const [product, setProduct] = useState(null); // State to hold the product data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [roles, setRoles] = useState([]); // User roles
    const [currentUsername, setCurrentUsername] = useState(''); // Current user's username

    // Fetch user roles and username when the component mounts
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const [rolesData, usernameData] = await Promise.all([
                    axiosHelper('/user/my-account/roles', 'GET'),
                    axiosHelper('/user/my-account/username', 'GET')
                ]);

                setRoles(rolesData); // Set user roles
                setCurrentUsername(usernameData); // Set current username
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError('Failed to load user details.');
            }
        };

        fetchUserDetails();
    }, []);

    // Fetch the specific product based on productId
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true); // Start loading
                const data = await axiosHelper(`/products/${productId}`, 'GET');
                setProduct(data); // Set the product data
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Failed to load the product.');
            } finally {
                setLoading(false); // Mark loading as complete
            }
        };

        fetchProduct();
    }, [productId]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="flex flex-row">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Product Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    {loading && <p className="text-gray-500">Loading product...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {product && (
                        <div className="w-full max-w-4xl">
                            <ProductCard
                                product={product}
                                userRoles={roles}
                                currentUsername={currentUsername}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;