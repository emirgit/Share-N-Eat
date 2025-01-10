import React, {useEffect, useState} from 'react';
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

const ProductManagement = () => {

    const [requests, setRequests] = useState([
        // {
        //     id: 2,
        //     name: 'Milk',
        //     brand: 'Sutas',
        //     category: 'Dairy',
        //     quantity: 1000,
        //     proteinGrams:3,
        //     carbonhydrateGrams:5,
        //     fatGrams:2,
        //     calories: 50,
        //     images: [Milk,Milk,Milk],
        //     description: 'description',
        // }
    ]);

    const [products, setProducts] = useState([]);

    //done
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await axiosHelper('/products/getAll');
                //console.log(allProducts);
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
            }
        };
        fetchProducts();
    }, []);


    // useEffect(() => {
    //     const fetchProductRequests = async () => {
    //         try {
    //             const allProductRequests = await axiosHelper('/admin/product-requests', 'GET');
    //             const productRequestsWithImages = await Promise.all(
    //                 allProductRequests.map(async (request) => {
    //                     const imagesResponse = await axiosHelper(`/admin/product-requests/getImages/${request.id}`, 'GET', null, { responseType: 'json' });
    //                     const images = imagesResponse.map(image => URL.createObjectURL(new Blob([new Uint8Array(image)])));
    //                     return { ...request, images };
    //                 })
    //             );
    //             setRequests(productRequestsWithImages);
    //         } catch (error) {
    //             console.error('Error fetching product requests:', error);
    //         }
    //     };
    //
    //     fetchProductRequests();
    // }, []);

    useEffect(() => {
        const fetchProductRequests = async () => {
            try {
                const allProductRequests = await axiosHelper('/admin/product-requests', 'GET');
                const productRequestsWithImages = await Promise.all(
                    allProductRequests.map(async (request) => {
                        const imagesResponse = await axiosHelper(`/admin/product-requests/getImages/${request.id}`, 'GET', null, { responseType: 'json' });
                        const images = imagesResponse.map(image => URL.createObjectURL(new Blob([new Uint8Array(image)])));
                        const [imageUrl, contentImageUrl, macrotableImageUrl] = images;
                        return { ...request, imageUrl, contentImageUrl, macrotableImageUrl };
                    })
                );
                setRequests(productRequestsWithImages);
            } catch (error) {
                console.error('Error fetching product requests:', error);
            }
        };

        fetchProductRequests();
    }, []);

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

    const handleAcceptRequest = async (id) => {
        const acceptedRequest = requests.find((request) => request.id === id);
        if (acceptedRequest) {

            const data = new FormData();
            data.append('name', acceptedRequest.name);
            data.append('brand', acceptedRequest.brand);
            data.append('category', acceptedRequest.category);
            data.append('content', acceptedRequest.description);
            data.append('file', acceptedRequest.imageUrl);
            data.append('quantity', acceptedRequest.quantity);

            data.append('calories', acceptedRequest.calories);
            data.append('proteinGrams', acceptedRequest.proteinGrams);
            data.append('carbonhydrateGrams', acceptedRequest.carbonhydrateGrams);
            data.append('fatGrams', acceptedRequest.fatGrams);


            try {
                const response = await axiosHelper('/admin/products', 'POST', data, {
                    'Content-Type': 'multipart/form-data',
                });
                console.log('Product uploaded successfully:', response);
            } catch (error) {
                console.error('Error uploading product:', error);
            }

        }
    };

    //done
    const handleDenyRequest = async (id) => {
        try {
            await axiosHelper(`/admin/product-requests/reject/${id}`, 'DELETE');
            setRequests(requests.filter((request) => request.id !== id));
        } catch (error) {
            console.error('Failed to deny request:', error);
        }
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


    const toggleEditMode = async (id) => {
        const productToUpdate = products.find((product) => product.id === id);
        if (productToUpdate.isEditing) {
            try {
                await axiosHelper(`/admin/products/${id}`, 'PUT', productToUpdate);
                console.log('Product updated successfully');
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

    // const toggleEditMode = (id) => {
    //     setProducts((prevProducts) =>
    //         prevProducts.map((product) =>
    //             product.id === id
    //                 ? { ...product, isEditing: !product.isEditing }
    //                 : product
    //         )
    //     );
    // };


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

    //done
    const handleRemoveProduct = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            try {
                await axiosHelper(`/admin/products/${id}`, 'DELETE');
                setProducts(products.filter((product) => product.id !== id));
            } catch (error) {
                console.error('Failed to deny request:', error);
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
                                            src={product.imageUrl}
                                            alt={`Product ${product.id}`}
                                            className="rounded-lg object-cover cursor-pointer"
                                            onClick={() => handleImageClick(product.imageUrl)}
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
                                                {[product.proteinGrams, product.carbonhydrateGrams, product.fatGrams].map((macro) => (
                                                    <div key={macro} className="flex items-center mb-2">
                                                        <span className="capitalize">{macro}:</span>
                                                        <input
                                                            type="number"
                                                            value={macro}
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
                                            {[request.imageUrl, request.contentImageUrl, request.macrotableImageUrl].map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        
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
                                    {/* Product Information */}
                                    <div className="flex-1 sm:ml-4">
                                        <h3 className="font-semibold">{request.name}</h3>
                                        <p className="text-gray-600">
                                            {request.category} - {request.quantity} g/ml
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
                                                        handleProductAttributeChange(request.id, 'brand', e.target.value)
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
                                                        handleProductAttributeChange(request.id, 'category', e.target.value)
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
                                                [request.proteinGrams, 'protein'],
                                                [request.carbonhydrateGrams, 'carbs'],
                                                [request.fatGrams, 'fat'],
                                            ].map(([value, name]) => (
                                                <div key={name} className="flex items-center mb-2">
                                                    <span className="capitalize">{name}:</span>
                                                    <input
                                                        type="number"
                                                        value={value}
                                                        onChange={(e) =>
                                                            handleEditMacros(request.id, name, e.target.value)
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
                                                    onChange={(e) => handleEditCalories(request.id, e.target.value)}
                                                    className="ml-2 w-16 border rounded px-1"
                                                />
                                            </div>
                                        </div>

                                        
                                    </div>

                                    {/* Description Section */}
                                    <div className="flex-1 mt-4">
                                        <h4 className="text-sm font-semibold">Description</h4>
                                        <p className="text-gray-500 italic mt-1">"{request.description}"</p>
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