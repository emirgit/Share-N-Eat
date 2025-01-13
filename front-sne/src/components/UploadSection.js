import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axiosHelper from '../axiosHelper';
import IngredientAdd from './IngredientAdd';

const UploadSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [products, setProducts] = useState([]); // Array to store added products
    const [showProductModal, setShowProductModal] = useState(false);

    // Mock product data
    const existingProducts = [
        {
            id: 1,
            name: 'Milk',
            brand: 'DairyBest',
            category: 'Dairy',
            content: 'Lactose-Free Milk',
            imageUrl: 'https://via.placeholder.com/100',
            calories: 100,
            proteinGrams: 3,
            carbonhydrateGrams: 5,
            fatGrams: 2,
        },
        {
            id: 2,
            name: 'Orange Juice',
            brand: 'Freshly',
            category: 'Drinks',
            content: 'Fresh Orange Juice',
            imageUrl: 'https://via.placeholder.com/100',
            calories: 90,
            proteinGrams: 1,
            carbonhydrateGrams: 20,
            fatGrams: 0,
        },
        // Add more mock products as needed
    ];

    const handleUploadClick = () => {
        setIsExpanded(true);
    };

    const handleCancel = () => {
        setIsExpanded(false);
        setTitle('');
        setDescription('');
        setProducts([]);
    };

    const handleAddProduct = () => {
        setShowProductModal(true);
    };

    const handleAddIngredient = (ingredient) => {
        setProducts([...products, ingredient]);
        setShowProductModal(false);
    };

    const handleSubmit = async () => {
        if (products.length === 0) {
            alert('Please add at least one product!');
            return;
        }

        const formData = new FormData();
        formData.append('postName', title);
        formData.append('description', description);
        formData.append('products', JSON.stringify(products)); // Send products as JSON

        try {
            await axiosHelper('/posts', 'POST', formData, {
                'Content-Type': 'multipart/form-data',
            });

            alert('Post created successfully!');
            handleCancel(); // Reset the form
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center w-full my-4">
            {!isExpanded && (
                <div
                    className="transition-all duration-300 ease-in-out w-full max-w-4xl bg-gray-100 p-8 rounded-lg shadow-md cursor-pointer"
                    onClick={handleUploadClick}
                >
                    <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faPlus} className="text-gray-500 text-5xl" />
                    </div>
                </div>
            )}

            {isExpanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                        <div className="flex flex-col items-center">
                            <h2 className="text-lg font-semibold mb-4">Create a New Post</h2>

                            {/* Title Input */}
                            <input
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 mb-3 border rounded-md"
                            />

                            {/* Description Input */}
                            <textarea
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 mb-3 border rounded-md"
                            ></textarea>

                            {/* Scrollable Product Section */}
                            <div className="w-full overflow-x-auto py-4">
                                <div className="flex items-center space-x-4">
                                    {products.map((product, index) => (
                                        <div
                                            key={index}
                                            className="w-32 h-32 relative flex-shrink-0"
                                        >
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center text-sm py-1 rounded-b-lg">
                                                {product.name} - {product.quantity} g/ml
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add Product Button */}
                            <button
                                onClick={handleAddProduct}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
                            >
                                Add Product
                            </button>

                            {/* Buttons */}
                            <div className="flex justify-end w-full space-x-4 mt-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {showProductModal && (
                <IngredientAdd
                    existingProducts={existingProducts}
                    onAddIngredient={handleAddIngredient}
                    onCancel={() => setShowProductModal(false)}
                />
            )}
        </div>
    );
};

export default UploadSection;




// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import axiosHelper from '../axiosHelper';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

// const UploadSection = () => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [carbs, setCarbs] = useState('');
//     const [protein, setProtein] = useState('');
//     const [fat, setFat] = useState('');
//     const [calories, setCalories] = useState('');
//     const [image, setImage] = useState(null);

//     const handleUploadClick = () => {
//         setIsExpanded(true);
//     };

//     const handleCancel = () => {
//         setIsExpanded(false);
//         setTitle('');
//         setDescription('');
//         setCarbs('');
//         setProtein('');
//         setFat('');
//         setCalories('');
//         setImage(null);
//     };

//     const handleImageChange = (e) => {
//         setImage(e.target.files[0]);
//     };

// const handleSubmit = async () => {
//     if (!image) {
//         alert('Please upload an image!');
//         return;
//     }

//     const formData = new FormData();
//     formData.append('postName', title);
//     formData.append('description', description);
//     formData.append('carbs', carbs || 0); // Default to 0 if empty
//     formData.append('protein', protein || 0);
//     formData.append('fat', fat || 0);
//     formData.append('calories', calories || 0);
//     formData.append('image', image);

//     try {
//         await axiosHelper('/posts', 'POST', formData, {
//             'Content-Type': 'multipart/form-data', // Ensure correct header for form data
//         });

//         alert('Post created successfully!');
//         handleCancel(); // Reset the form
//     } catch (error) {
//         console.error('Error creating post:', error);
//         alert('An unexpected error occurred.');
//     }
// };


//     return (
//         <div className="flex items-center justify-center w-full my-4">
//             {!isExpanded && (
//                 <div
//                     className="transition-all duration-300 ease-in-out w-full max-w-4xl bg-gray-100 p-8 rounded-lg shadow-md cursor-pointer"
//                     onClick={handleUploadClick}
//                 >
//                     <div className="flex items-center justify-center">
//                         <FontAwesomeIcon icon={faPlus} className="text-gray-500 text-5xl" />
//                     </div>
//                 </div>
//             )}

//             {isExpanded && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
//                         <div className="flex flex-col items-center">
//                             <h2 className="text-lg font-semibold mb-4">Create a New Post</h2>
//                             <input
//                                 type="text"
//                                 placeholder="Enter title"
//                                 value={title}
//                                 onChange={(e) => setTitle(e.target.value)}
//                                 className="w-full p-2 mb-3 border rounded-md"
//                             />
//                             <textarea
//                                 placeholder="Enter description"
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                                 className="w-full p-2 mb-3 border rounded-md"
//                             />
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="mb-3"
//                             />
//                             {image && (
//                                 <img
//                                     src={URL.createObjectURL(image)}
//                                     alt="Preview"
//                                     className="w-full max-h-96 object-contain rounded-md mb-3"
//                                 />
//                             )}
//                             <div className="w-full grid grid-cols-2 gap-4">
//                                 <input
//                                     type="number"
//                                     placeholder="Carbs (g)"
//                                     value={carbs}
//                                     onChange={(e) => setCarbs(e.target.value)}
//                                     className="p-2 border rounded-md"
//                                 />
//                                 <input
//                                     type="number"
//                                     placeholder="Protein (g)"
//                                     value={protein}
//                                     onChange={(e) => setProtein(e.target.value)}
//                                     className="p-2 border rounded-md"
//                                 />
//                                 <input
//                                     type="number"
//                                     placeholder="Fat (g)"
//                                     value={fat}
//                                     onChange={(e) => setFat(e.target.value)}
//                                     className="p-2 border rounded-md"
//                                 />
//                                 <input
//                                     type="number"
//                                     placeholder="Calories"
//                                     value={calories}
//                                     onChange={(e) => setCalories(e.target.value)}
//                                     className="p-2 border rounded-md"
//                                 />
//                             </div>
//                             <div className="flex justify-end w-full space-x-4 mt-4">
//                                 <button
//                                     onClick={handleCancel}
//                                     className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleSubmit}
//                                     className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                                 >
//                                     Post
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UploadSection;
