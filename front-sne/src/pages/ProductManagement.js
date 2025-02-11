import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import AdminNavbar from '../components/AdminNavbar';
import AdminMenu from '../components/AdminMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faTimes } from '@fortawesome/free-solid-svg-icons';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Milk from '../assets/Milk.jpg';
// import tavukPilav from '../assets/tavukPilav.png';
// import ramen from '../assets/ramen.jpeg';
import axiosHelper from "../axiosHelper";
import { categories } from '../components/CategoriesSection';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
    const navigate = useNavigate();
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    const [requests, setRequests] = useState([
        // Initial state
    ]);

    const [products, setProducts] = useState([]);

    // Fetch Product Requests
    useEffect(() => {
        const fetchProductRequests = async () => {
            try {
                const allProductRequests = await axiosHelper('/admin/product-requests', 'GET');
                const productRequestsWithImages = await Promise.all(
                    allProductRequests.map(async (request) => {
                        const imagesResponse = await axiosHelper(`/admin/product-requests/getImages/${request.id}`, 'GET', null, { responseType: 'json' });
                        const images = imagesResponse.map(image => `data:image/jpeg;base64,${image}`);
                        const [imageUrlLocal, contentImageUrlLocal, macrotableImageUrlLocal] = images;
                        return { ...request, imageUrlLocal, contentImageUrlLocal, macrotableImageUrlLocal };
                    })
                );
                setRequests(productRequestsWithImages);
            } catch (error) {
                console.error('Error fetching product requests:', error);
            }
        };

        fetchProductRequests();
    }, []);

    // Handle Image Change
    const handleImageChange = (requestId, imageIndex, file) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId
                    ? {
                        ...request,
                        newImage: file,
                        imageUrlLocal: URL.createObjectURL(file),
                    }
                    : request
            )
        );
    };

    // Handle Accept Request
    const handleAcceptRequest = async (id) => {
        const acceptedRequest = requests.find((request) => request.id === id);
        if (acceptedRequest) {
            const data = new FormData();
            data.append('name', acceptedRequest.name);
            data.append('brand', acceptedRequest.brand);
            data.append('category', acceptedRequest.category);
            data.append('content', acceptedRequest.description); // content of the product
            data.append('quantity', acceptedRequest.quantity);
            data.append('calories', acceptedRequest.calories);
            data.append('proteinGrams', acceptedRequest.proteinGrams);
            data.append('carbonhydrateGrams', acceptedRequest.carbonhydrateGrams);
            data.append('fatGrams', acceptedRequest.fatGrams);

            if (acceptedRequest.newImage) {
                data.append('file', acceptedRequest.newImage);
            } else {
                data.append('file', null);
            }

            try {
                const response = await axiosHelper(`/admin/approve-product-request/${id}`, 'POST', data, {
                    'Content-Type': 'multipart/form-data',
                });
                console.log('Product uploaded successfully:', response);
                window.location.reload(); // Refresh the page after successful accept
            } catch (error) {
                console.error('Error uploading product:', error);
            }
        }
    };

    // Handle Deny Request
    const handleDenyRequest = async (id) => {
        try {
            await axiosHelper(`/admin/product-requests/reject/${id}`, 'DELETE');
            setRequests(requests.filter((request) => request.id !== id));
            window.location.reload(); // Refresh the page after successful deny
        } catch (error) {
            console.error('Failed to deny request:', error);
        }
    };

    // Handle Request Attribute Change
    const handleRequestAttributeChange = (id, attribute, value) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === id
                    ? {
                        ...request,
                        [attribute]:
                            attribute === 'quantity' || attribute === 'calories' || attribute === 'proteinGrams' || attribute === 'carbonhydrateGrams' || attribute === 'fatGrams'
                                ? parseFloat(value) || 0
                                : value,
                    }
                    : request
            )
        );
    }

    // Handle Image Click
    const handleImageClick = (imageUrl) => {
        const newWindow = window.open();
        newWindow.document.write(`<img src="${imageUrl}" alt="Image" />`);
        newWindow.document.close();
    };
    
    const handleImageClickProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await axiosHelper('/products/getAll');
                const productsWithImages = await Promise.all(
                    allProducts.map(async (product) => {
                        const imageResponse = await axiosHelper(`/products/getImage/${product.id}`, 'GET', null, {responseType: 'blob'});
                        const imageUrlLocal = URL.createObjectURL(imageResponse);
                        return {...product, imageUrlLocal};
                    })
                );
                setProducts(productsWithImages);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
        fetchProducts();
    }, []);

    // Toggle Edit Mode
    const toggleEditMode = async (id) => {
        const productToUpdate = products.find((product) => product.id === id);
        if (productToUpdate.isEditing) {
            try {
                await axiosHelper(`/admin/products/${id}`, 'PUT', productToUpdate);
                console.log('Product updated successfully');
                window.location.reload(); // Refresh the page after successful update
            } catch (error) {
                console.error('Failed to update product:', error);
            }
        }
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id
                    ? { ...product, isEditing: !product.isEditing }
                    : product
            )
        );
    };

    // Handle Product Attribute Change
    const handleProductAttributeChange = (id, attribute, value) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id
                    ? {
                        ...product,
                        [attribute]:
                            attribute === 'quantity' || attribute === 'calories' || attribute === 'proteinGrams' || attribute === 'carbonhydrateGrams' || attribute === 'fatGrams'
                                ? parseFloat(value) || 0
                                : value,
                    }
                    : product
            )
        );
    };

    // Handle Remove Product
    const handleRemoveProduct = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            try {
                await axiosHelper(`/admin/products/${id}`, 'DELETE');
                setProducts(products.filter((product) => product.id !== id));
                window.location.reload(); // Refresh the page after successful removal
            } catch (error) {
                console.error('Failed to remove product:', error);
            }
        }
    };

    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            <AdminNavbar />
            <div className="flex">
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-6">Product Management</h1>

                    {/* Product List */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Product List</h2>
                        <ul className="space-y-4">
                            {products.map((product) => (
                                <li key={product.id} className="flex items-center space-x-4">
                                    <div className="w-40">
                                        <img
                                            src={product.imageUrlLocal}
                                            alt={`Product ${product.id}`}
                                            className="rounded-lg object-cover cursor-pointer"
                                            onClick={() => handleImageClickProduct(product.id)}
                                        />
                                    </div>
                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{product.name}</h3>
                                        <p className="text-gray-600">Brand: {product.brand}</p>
                                        <p className="text-gray-600">
                                            {product.category} - {product.quantity} g/ml
                                        </p>
                                        {product.isEditing ? (
                                            <div className="text-gray-600 text-sm">
                                                <div className="flex items-center mb-2">
                                                    <span>Brand:</span>
                                                    <input
                                                        type="text"
                                                        value={product.brand}
                                                        onChange={(e) =>
                                                            handleProductAttributeChange(product.id, 'brand', e.target.value)
                                                        }
                                                        className="ml-2 border rounded px-1"
                                                    />
                                                </div>
                                                {[
                                                    { key: 'proteinGrams', value: product.proteinGrams },
                                                    { key: 'carbonhydrateGrams', value: product.carbonhydrateGrams },
                                                    { key: 'fatGrams', value: product.fatGrams }
                                                ].map((macro) => (
                                                    <div key={macro.key} className="flex items-center mb-2">
                                                        <span className="capitalize">{macro.key}:</span>
                                                        <input
                                                            type="number"
                                                            value={macro.value}
                                                            onChange={(e) =>
                                                                handleProductAttributeChange(
                                                                    product.id,
                                                                    macro.key,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="ml-2 w-16 border rounded px-1"
                                                        />
                                                        g
                                                    </div>
                                                ))}
                                                <div className="flex items-center mb-2">
                                                    <span>Calories:</span>
                                                    <input
                                                        type="number"
                                                        value={product.calories}
                                                        onChange={(e) =>
                                                            handleProductAttributeChange(
                                                                product.id,
                                                                'calories',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="ml-2 w-16 border rounded px-1"
                                                    />
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <span>Quantity:</span>
                                                    <input
                                                        type="number"
                                                        value={product.quantity}
                                                        onChange={(e) =>
                                                            handleProductAttributeChange(
                                                                product.id,
                                                                'quantity',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="ml-2 w-16 border rounded px-1"
                                                    />
                                                    g/ml
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-sm">
                                                Protein: {product.proteinGrams}g, Carbs:{' '}
                                                {product.carbonhydrateGrams}g, Fat:{' '}
                                                {product.fatGrams}g, Calories:{' '}
                                                {product.calories}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => toggleEditMode(product.id)}
                                            className={`${
                                                product.isEditing
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : 'bg-yellow-500 hover:bg-yellow-600'
                                            } text-white px-4 py-2 rounded-lg`}
                                        >
                                            {product.isEditing ? 'Done' : 'Edit'}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveProduct(product.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Product Requests */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Product Requests</h2>
                        <ul className="space-y-4">
                            {requests.map((request) => (
                                <li
                                    key={request.id}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b pb-4 mb-4"
                                >
                                    <div className="w-40">
                                        <Slider {...sliderSettings}>
                                            {[request.imageUrlLocal, request.contentImageUrlLocal, request.macrotableImageUrlLocal].map((image, index) => (
                                                <div key={index} className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageChange(request.id, index, e.target.files[0])}
                                                    />
                                                    <img
                                                        src={image}
                                                        alt={`Request ${request.id}`}
                                                        className="rounded-lg object-cover cursor-pointer"
                                                        onClick={() => handleImageClick(image)}
                                                    />
                                                    {image === request.imageUrlLocal ? (
                                                        <button
                                                            onClick={() => document.querySelector(`input[type="file"]`).click()}
                                                            className="absolute top-1 right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded"
                                                        >
                                                            <FontAwesomeIcon icon={faRecycle} />
                                                        </button>
                                                    ) : (
                                                        <p></p>
                                                    )}
                                                    {/* Uncomment if you want to enable image removal
                                                    <button
                                                        onClick={() => handleRemoveImage(request.id, index)}
                                                        className="absolute bottom-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                    */}
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>
                                    {/* Product Information */}
                                    <div className="flex-1 sm:ml-4">
                                        <h3 className="font-semibold">
                                            <input
                                                type="text"
                                                value={request.name}
                                                onChange={(e) => handleRequestAttributeChange(request.id, 'name', e.target.value)}
                                                className="border rounded px-1"
                                            />
                                        </h3>
                                        <p className="text-gray-600">
                                            {request.category} -
                                            <input
                                                type="number"
                                                value={request.quantity}
                                                onChange={(e) => handleRequestAttributeChange(request.id, 'quantity', e.target.value)}
                                                className="border rounded px-1 ml-2 w-16"
                                            />
                                            g/ml
                                        </p>

                                        {/* Nutrition Facts Section */}
                                        <div className="text-gray-600 text-sm">
                                            {/* Brand */}
                                            <div className="flex items-center mb-2">
                                                <span>Brand:</span>
                                                <input
                                                    type="text"
                                                    value={request.brand}
                                                    onChange={(e) =>
                                                        handleRequestAttributeChange(request.id, 'brand', e.target.value)
                                                    }
                                                    className="ml-2 border rounded px-1"
                                                />
                                            </div>

                                            {/* Categories Dropdown */}
                                            <div className="flex items-center mb-2">
                                                <span>Category:</span>
                                                <select
                                                    value={request.category}
                                                    onChange={(e) =>
                                                        handleRequestAttributeChange(request.id, 'category', e.target.value)
                                                    }
                                                    className="ml-2 border rounded px-2"
                                                >
                                                    {categories.map((cat, idx) => (
                                                        <option key={idx} value={cat.name}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Macronutrients */}
                                            {[
                                                ['proteinGrams', request.proteinGrams],
                                                ['carbonhydrateGrams', request.carbonhydrateGrams],
                                                ['fatGrams', request.fatGrams],
                                            ].map(([name, value]) => (
                                                <div key={name} className="flex items-center mb-2">
                                                    <span className="capitalize">{name.replace('Grams', '')}:</span>
                                                    <input
                                                        type="number"
                                                        value={value}
                                                        onChange={(e) =>
                                                            handleRequestAttributeChange(request.id, name, e.target.value)
                                                        }
                                                        className="ml-2 w-16 border rounded px-1"
                                                    />
                                                    g
                                                </div>
                                            ))}

                                            {/* Calories */}
                                            <div className="flex items-center mb-2">
                                                <span>Calories:</span>
                                                <input
                                                    type="number"
                                                    value={request.calories}
                                                    onChange={(e) => handleRequestAttributeChange(request.id, 'calories', e.target.value)}
                                                    className="ml-2 w-16 border rounded px-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description Section */}
                                    <div className="flex-1 mt-4">
                                        <h4 className="text-sm font-semibold">Description</h4>
                                        <textarea
                                            value={request.description}
                                            onChange={(e) => handleRequestAttributeChange(request.id, 'description', e.target.value)}
                                            className="w-full border rounded px-1"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2 sm:mt-0 sm:ml-4">
                                        <button
                                            onClick={() => handleAcceptRequest(request.id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleDenyRequest(request.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                        >
                                            Deny
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <AdminMenu />
            </div>
        </div>
    );
};

export default ProductManagement;
