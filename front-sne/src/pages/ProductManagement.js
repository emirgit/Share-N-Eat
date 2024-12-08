import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminMenu from '../components/AdminMenu';

const ProductManagement = () => {
    // Mock data for products
    const [products, setProducts] = useState([
        { id: 1, name: 'Milk', category: 'Dairy', quantity: '1L', macronutrients: { protein: 3, carbs: 5, fat: 2 } },
        { id: 2, name: 'Banana', category: 'Fruits', quantity: '1kg', macronutrients: { protein: 1, carbs: 20, fat: 0 } },
    ]);

    // Mock data for product requests
    const [requests, setRequests] = useState([
        {
            id: 1,
            name: 'Almond Milk',
            category: 'Dairy',
            quantity: '1L',
            macronutrients: { protein: 1, carbs: 4, fat: 2 },
            reason: 'I am lactose intolerant.',
        },
        {
            id: 2,
            name: 'Protein Bars',
            category: 'Snacks',
            quantity: '500g',
            macronutrients: { protein: 20, carbs: 15, fat: 5 },
            reason: 'For gym and fitness enthusiasts.',
        },
    ]);

    // States for adding/editing products
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({ name: '', category: '', quantity: '', protein: '', carbs: '', fat: '' });

    // Handle form input change
    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add a new product
    const handleAddProduct = () => {
        const newProduct = {
            id: products.length + 1,
            name: form.name,
            category: form.category,
            quantity: form.quantity,
            macronutrients: {
                protein: parseInt(form.protein, 10),
                carbs: parseInt(form.carbs, 10),
                fat: parseInt(form.fat, 10),
            },
        };
        setProducts([...products, newProduct]);
        setForm({ name: '', category: '', quantity: '', protein: '', carbs: '', fat: '' });
        setIsAdding(false);
    };

    // Edit an existing product
    const handleEditProduct = (id) => {
        const product = products.find((product) => product.id === id);
        setEditingProduct(id);
        setForm({
            name: product.name,
            category: product.category,
            quantity: product.quantity,
            protein: product.macronutrients.protein,
            carbs: product.macronutrients.carbs,
            fat: product.macronutrients.fat,
        });
    };

    const handleSaveEdit = () => {
        setProducts(
            products.map((product) =>
                product.id === editingProduct
                    ? {
                          ...product,
                          name: form.name,
                          category: form.category,
                          quantity: form.quantity,
                          macronutrients: {
                              protein: parseInt(form.protein, 10),
                              carbs: parseInt(form.carbs, 10),
                              fat: parseInt(form.fat, 10),
                          },
                      }
                    : product
            )
        );
        setEditingProduct(null);
        setForm({ name: '', category: '', quantity: '', protein: '', carbs: '', fat: '' });
    };

    // Remove a product
    const handleRemoveProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter((product) => product.id !== id));
        }
    };

    // Accept a request
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
                },
            ]);
            setRequests(requests.filter((request) => request.id !== id));
        }
    };

    // Deny a request
    const handleDenyRequest = (id) => {
        setRequests(requests.filter((request) => request.id !== id));
    };

    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            <AdminNavbar/>
            <div className='flex'>
                
                <div className='flex-1 p-8'>
                <h1 className="text-3xl font-bold mb-6">Product Management</h1>

                {/* Add or Edit Product */}
                {(isAdding || editingProduct !== null) && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {isAdding ? 'Add New Product' : 'Edit Product'}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleInputChange}
                                placeholder="Product Name"
                                className="border rounded-lg p-2"
                            />
                            <input
                                name="category"
                                value={form.category}
                                onChange={handleInputChange}
                                placeholder="Category"
                                className="border rounded-lg p-2"
                            />
                            <input
                                name="quantity"
                                value={form.quantity}
                                onChange={handleInputChange}
                                placeholder="Quantity (e.g., 1L, 500g)"
                                className="border rounded-lg p-2"
                            />
                            <input
                                name="protein"
                                value={form.protein}
                                onChange={handleInputChange}
                                placeholder="Protein (g)"
                                className="border rounded-lg p-2"
                            />
                            <input
                                name="carbs"
                                value={form.carbs}
                                onChange={handleInputChange}
                                placeholder="Carbs (g)"
                                className="border rounded-lg p-2"
                            />
                            <input
                                name="fat"
                                value={form.fat}
                                onChange={handleInputChange}
                                placeholder="Fat (g)"
                                className="border rounded-lg p-2"
                            />
                        </div>
                        <div className="mt-4 flex space-x-4">
                            <button
                                onClick={isAdding ? handleAddProduct : handleSaveEdit}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                {isAdding ? 'Add Product' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingProduct(null);
                                    setForm({ name: '', category: '', quantity: '', protein: '', carbs: '', fat: '' });
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Product List */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Product List</h2>
                    <ul className="space-y-4">
                        {products.map((product) => (
                            <li key={product.id} className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-gray-600">
                                        {product.category} - {product.quantity}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Protein: {product.macronutrients.protein}g, Carbs: {product.macronutrients.carbs}g,
                                        Fat: {product.macronutrients.fat}g
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleEditProduct(product.id)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                    >
                                        Edit
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
                            <li key={request.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4 mb-4">
                                <div>
                                    <h3 className="font-semibold">{request.name}</h3>
                                    <p className="text-gray-600">
                                        {request.category} - {request.quantity}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Protein: {request.macronutrients.protein}g, Carbs: {request.macronutrients.carbs}g,
                                        Fat: {request.macronutrients.fat}g
                                    </p>
                                    <p className="text-gray-500 italic">"{request.reason}"</p>
                                </div>
                                <div className="flex space-x-4 mt-4 sm:mt-0">
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

                {/* Add Product Button */}
                {!isAdding && editingProduct === null && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 mt-6"
                    >
                        Add New Product
                    </button>
                )}
                
                </div>
                <AdminMenu/>
            </div>
            
        </div>
    );
};

export default ProductManagement;
