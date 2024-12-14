import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductUpload from '../components/ProductUpload';
import ProductCard from '../components/ProductCard';
import CategoriesSection from '../components/CategoriesSection';
import axiosHelper from "../axiosHelper";

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state for posts
    const [error, setError] = useState(null); // Error state for posts
    const [roles, setRoles] = useState([]); // State to hold user roles
    const [rolesLoading, setRolesLoading] = useState(true); // Loading state for roles
    const [rolesError, setRolesError] = useState(null); // Error state for roles
    const [currentUsername, setCurrentUsername] = useState(''); // State to hold the current username
    const [usernameLoading, setUsernameLoading] = useState(true); // Loading state for username
    const [usernameError, setUsernameError] = useState(null); // Error state for username
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [sortOption, setSortOption] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');


    // Fetch user roles when the component mounts
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await axiosHelper('/user/my-account/roles', 'GET'); // Endpoint to fetch user roles
                setRoles(data); // Set the retrieved roles in state
            } catch (error) {
                console.error('Error fetching user roles:', error);
                setRolesError('Failed to load user roles.');
            } finally {
                setRolesLoading(false); // Mark roles loading as complete
            }
        };

        fetchRoles(); // Call the fetchRoles function
    }, []);

    // Fetch the current username when the component mounts
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const data = await axiosHelper('/user/my-account/username', 'GET'); // Endpoint to fetch username
                setCurrentUsername(data); // Set the retrieved username in state
            } catch (error) {
                console.error('Error fetching username:', error);
                setUsernameError('Failed to load username.');
            } finally {
                setUsernameLoading(false); // Mark username loading as complete
            }
        };

        fetchUsername(); // Call the fetchUsername function
    }, []);

    useEffect(() => {
        if(!rolesError && !usernameError && !rolesLoading && !usernameLoading) {
            const fetchProducts = async () => {
                try {
                    const allProducts = await axiosHelper('/products/getAll');
                    const productsWithImages = await Promise.all(
                        allProducts.map(async (product) => {
                            const imageResponse = await axiosHelper(`/products/getImage/${product.id}`, 'GET', null, {responseType: 'blob'});
                            const imageUrl = URL.createObjectURL(imageResponse);
                            return {...product, imageUrl};
                        })
                    );
                    setProducts(productsWithImages);
                } catch (error) {
                    console.error('Failed to fetch products:', error);
                    setError('Failed to load products. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [rolesError, usernameError, rolesLoading, usernameLoading]);

    const handleSort = async (option, order = 'asc') => {
        setSortOption(option);
        try {
            const sortedProducts = await axiosHelper(`/products/sortedBy${option}/${order}`);
            setProducts(sortedProducts);
        } catch (error) {
            console.error('Failed to sort products:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const searchedProducts = await axiosHelper(`/products/search?keyword=${searchKeyword}`);
            setProducts(searchedProducts);
        } catch (error) {
            console.error('Failed to search products:', error);
        }
    };

    const filteredProducts =
        selectedCategory === 'All Products'
            ? products
            : products.filter((product) => product.category === selectedCategory);

    const sortedProducts = filteredProducts.slice().sort((a, b) => {
        switch (sortOption) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'rating':
                return b.averageRateExpert - a.averageRateExpert;
            case 'protein':
                return b.proteinGrams - a.proteinGrams;
            case 'carbs':
                return b.carbonhydratesGrams - a.carbonhydratesGrams;
            case 'fat':
                return b.fatGrams - a.fatGrams;
            default:
                return 0; // No sorting
        }
    });

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 px-8 py-4">
                    <CategoriesSection onCategorySelect={setSelectedCategory} />
                    <div className="flex justify-between items-center mb-6">
                        <ProductUpload />
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Search products..."
                            className="border p-2 rounded-lg"
                        />
                        <button onClick={handleSearch} className="ml-2 text-blue-500 font-medium">
                            Search
                        </button>
                    </div>
                    <div className="flex justify-end mb-6">
                        <select
                            value={sortOption}
                            onChange={(e) => handleSort(e.target.value)}
                            className="border p-2 rounded-lg"
                        >
                            <option value="">Sort by</option>
                            <option value="name">Sort by Name</option>
                            <option value="rating">Sort by Rating</option>
                            <option value="protein">Sort by Protein</option>
                            <option value="carbs">Sort by Carbs</option>
                            <option value="fat">Sort by Fat</option>
                        </select>
                    </div>
                    <div>
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} userRoles={roles} currentUsername={currentUsername} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;