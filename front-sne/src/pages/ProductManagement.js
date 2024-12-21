import React, { useState } from 'react';
import Slider from 'react-slick';
import AdminNavbar from '../components/AdminNavbar';
import AdminMenu from '../components/AdminMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faTimes } from '@fortawesome/free-solid-svg-icons';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Milk from '../assets/Milk.jpg';

const ProductManagement = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Milk',
            brand: 'İcim',
            category: 'Dairy',
            quantity: 1000,
            macronutrients: { protein: 3, carbs: 5, fat: 2, sugar: 4 },
            calories: 50,
            images: [Milk],
        },
    ]);

    const [requests, setRequests] = useState([

    ]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    const handleImageChange = (requestId, imageIndex, newImageUrl) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId
                    ? {
                          ...request,
                          images: request.images.map((img, idx) =>
                              idx === imageIndex ? newImageUrl : img
                          ),
                      }
                    : request
            )
        );
    };

    const handleRemoveImage = (requestId, imageIndex) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId
                    ? {
                          ...request,
                          images: request.images.filter((_, idx) => idx !== imageIndex),
                      }
                    : request
            )
        );
    };

    const handleAcceptRequest = (id) => {
        const acceptedRequest = requests.find((request) => request.id === id);
        if (acceptedRequest) {
            setProducts([
                ...products,
                {
                    id: products.length + 1,
                    name: acceptedRequest.name,
                    category: acceptedRequest.category,
                    quantity: acceptedRequest.quantity,
                    macronutrients: acceptedRequest.macronutrients,
                    calories: acceptedRequest.calories,
                    images: acceptedRequest.images,
                },
            ]);
            setRequests(requests.filter((request) => request.id !== id));
        }
    };

    const handleDenyRequest = (id) => {
        setRequests(requests.filter((request) => request.id !== id));
    };

    const handleEditMacros = (id, macroKey, newValue) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === id
                    ? {
                          ...request,
                          macronutrients: {
                              ...request.macronutrients,
                              [macroKey]: parseFloat(newValue) || 0,
                          },
                      }
                    : request
            )
        );
    };

    const handleEditCalories = (id, newValue) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === id
                    ? {
                          ...request,
                          calories: parseInt(newValue, 10) || 0,
                      }
                    : request
            )
        );
    };

    const handleImageClick = (imageUrl) => {
        window.open(imageUrl, '_blank'); // Open image in a new tab
    };


    const toggleEditMode = (id) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id
                    ? { ...product, isEditing: !product.isEditing }
                    : product
            )
        );
    };

    // Update product macros and attributes
    const handleProductAttributeChange = (id, attribute, value) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id
                    ? {
                          ...product,
                          [attribute]:
                              attribute === 'quantity' || attribute === 'calories'
                                  ? parseInt(value, 10) || 0
                                  : product[attribute],
                          macronutrients: attribute in product.macronutrients
                              ? { ...product.macronutrients, [attribute]: parseFloat(value) || 0 }
                              : product.macronutrients,
                      }
                    : product
            )
        );
    };

    const handleRemoveProduct = (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            setProducts(products.filter((product) => product.id !== id));
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
                                    {/* Product Image Slider */}
                                    <div className="w-40">
                                        <Slider {...sliderSettings}>
                                            {product.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Product ${product.id}`}
                                                    className="rounded-lg object-cover cursor-pointer"
                                                    onClick={() => handleImageClick(image)}
                                                />
                                            ))}
                                        </Slider>
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
                                                {['protein', 'carbs', 'fat', 'sugar'].map((macro) => (
                                                    <div key={macro} className="flex items-center mb-2">
                                                        <span className="capitalize">{macro}:</span>
                                                        <input
                                                            type="number"
                                                            value={product.macronutrients[macro]}
                                                            onChange={(e) =>
                                                                handleProductAttributeChange(
                                                                    product.id,
                                                                    macro,
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
                                                Protein: {product.macronutrients.protein}g, Carbs:{' '}
                                                {product.macronutrients.carbs}g, Fat:{' '}
                                                {product.macronutrients.fat}g, Sugar:{' '}
                                                {product.macronutrients.sugar}g, Calories:{' '}
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
                                            {request.images.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Request ${request.id}`}
                                                        className="rounded-lg object-cover cursor-pointer"
                                                        onClick={() => handleImageClick(image)}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleImageChange(
                                                                request.id,
                                                                index,
                                                                prompt(
                                                                    'Enter new image URL:',
                                                                    image
                                                                ) || image
                                                            )
                                                        }
                                                        className="absolute top-1 right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded"
                                                    >
                                                        <FontAwesomeIcon icon={faRecycle} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveImage(request.id, index)
                                                        }
                                                        className="absolute bottom-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>
                                    <div className="flex-1 sm:ml-4">
                                        <h3 className="font-semibold">{request.name}</h3>
                                        <p className="text-gray-600">
                                            {request.category} - {request.quantity} g/ml
                                        </p>
                                        <div className="text-gray-600 text-sm">
                                                <div className="flex items-center mb-2">
                                                    <span>Brand:</span>
                                                    <input
                                                        type="text"
                                                        value={request.brand}
                                                        onChange={(e) =>
                                                            handleProductAttributeChange(request.id, 'brand', e.target.value)
                                                        }
                                                        className="ml-2 border rounded px-1"
                                                    />
                                                </div>
                                            {['protein', 'carbs', 'fat', 'sugar'].map((macro) => (
                                                <div key={macro} className="flex items-center mb-2">
                                                    <span className="capitalize">{macro}:</span>
                                                    <input
                                                        type="number"
                                                        value={request.macronutrients[macro]}
                                                        onChange={(e) =>
                                                            handleEditMacros(request.id, macro, e.target.value)
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
                                                    value={request.calories}
                                                    onChange={(e) =>
                                                        handleEditCalories(request.id, e.target.value)
                                                    }
                                                    className="ml-2 w-16 border rounded px-1"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-gray-500 italic">"{request.reason}"</p>
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