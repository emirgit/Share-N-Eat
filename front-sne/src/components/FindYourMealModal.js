import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindYourMealModal = ({ isOpen, onClose, onSubmit }) => {
    const [nutritionValues, setNutritionValues] = useState({
        carbs: { min: '', max: '' },
        fat: { min: '', max: '' },
        protein: { min: '', max: '' },
        calories: { min: '', max: '' }
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateInputs = () => {
        const newErrors = {};
        let hasAtLeastOne = false;
        let totalMinNutrients = 0;

        // Helper function to validate a range
        const validateRange = (min, max, field) => {
            if (min !== '' || max !== '') {
                hasAtLeastOne = true;
                
                // Check for negative numbers
                if (min !== '' && (isNaN(min) || Number(min) < 0)) {
                    newErrors[`${field}Min`] = 'Must be a positive number';
                }
                if (max !== '' && (isNaN(max) || Number(max) < 0)) {
                    newErrors[`${field}Max`] = 'Must be a positive number';
                }
                
                // Check min > max
                if (min !== '' && max !== '' && Number(min) > Number(max)) {
                    newErrors[`${field}Range`] = 'Min value cannot be greater than max';
                }

                // Add to total minimum nutrients (excluding calories)
                if (field !== 'calories' && min !== '') {
                    totalMinNutrients += Number(min);
                }
            }
        };

        // Validate each range
        validateRange(nutritionValues.carbs.min, nutritionValues.carbs.max, 'carbs');
        validateRange(nutritionValues.fat.min, nutritionValues.fat.max, 'fat');
        validateRange(nutritionValues.protein.min, nutritionValues.protein.max, 'protein');
        validateRange(nutritionValues.calories.min, nutritionValues.calories.max, 'calories');

        // Check if total minimum nutrients exceeds 100g
        if (totalMinNutrients > 100) {
            newErrors.totalNutrients = 'Total minimum nutrients cannot exceed 100g per 100g serving';
        }

        if (!hasAtLeastOne) {
            newErrors.general = 'At least one criterion must be specified';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateInputs()) {
            // Store search criteria in localStorage for persistence
            localStorage.setItem('mealSearchCriteria', JSON.stringify(nutritionValues));
            
            // Pass the criteria to parent component
            onSubmit(nutritionValues);
            
            // Close modal
            onClose();
            
            // Navigate to results page with search criteria
            navigate('/find-your-meal', { 
                state: { 
                    nutritionValues,
                    searchTime: new Date().toISOString()
                }
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Find Your Meal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Carbohydrates */}
                    <div>
                        <label className="block font-medium mb-2">Carbohydrates (g/100g serving)</label>
                        <div className="flex space-x-4">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-1/2 p-2 border rounded"
                                value={nutritionValues.carbs.min}
                                onChange={(e) => setNutritionValues({
                                    ...nutritionValues,
                                    carbs: { ...nutritionValues.carbs, min: e.target.value }
                                })}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-1/2 p-2 border rounded"
                                value={nutritionValues.carbs.max}
                                onChange={(e) => setNutritionValues({
                                    ...nutritionValues,
                                    carbs: { ...nutritionValues.carbs, max: e.target.value }
                                })}
                            />
                        </div>
                        {errors.carbsMin && <p className="text-red-500 text-sm">{errors.carbsMin}</p>}
                        {errors.carbsMax && <p className="text-red-500 text-sm">{errors.carbsMax}</p>}
                        {errors.carbsRange && <p className="text-red-500 text-sm">{errors.carbsRange}</p>}
                    </div>

                    {/* Fat */}
                    <div>
                        <label className="block font-medium mb-2">Fat (g/100g serving)</label>
                        <div className="flex space-x-4">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-1/2 p-2 border rounded"
                                value={nutritionValues.fat.min}
                                onChange={(e) => setNutritionValues({
                                    ...nutritionValues,
                                    fat: { ...nutritionValues.fat, min: e.target.value }
                                })}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-1/2 p-2 border rounded"
                                value={nutritionValues.fat.max}
                                onChange={(e) => setNutritionValues({
                                    ...nutritionValues,
                                    fat: { ...nutritionValues.fat, max: e.target.value }
                                })}
                            />
                        </div>
                        {errors.fatMin && <p className="text-red-500 text-sm">{errors.fatMin}</p>}
                        {errors.fatMax && <p className="text-red-500 text-sm">{errors.fatMax}</p>}
                        {errors.fatRange && <p className="text-red-500 text-sm">{errors.fatRange}</p>}
                    </div>

                    {/* Protein */}
                    <div>
                        <label className="block font-medium mb-2">Protein (g/100g serving)</label>
                        <div className="flex space-x-4">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-1/2 p-2 border rounded"
                                value={nutritionValues.protein.min}
                                onChange={(e) => setNutritionValues({
                                    ...nutritionValues,
                                    protein: { ...nutritionValues.protein, min: e.target.value }
                                })}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-1/2 p-2 border rounded"
                                value={nutritionValues.protein.max}
                                onChange={(e) => setNutritionValues({
                                    ...nutritionValues,
                                    protein: { ...nutritionValues.protein, max: e.target.value }
                                })}
                            />
                        </div>
                        {errors.proteinMin && <p className="text-red-500 text-sm">{errors.proteinMin}</p>}
                        {errors.proteinMax && <p className="text-red-500 text-sm">{errors.proteinMax}</p>}
                        {errors.proteinRange && <p className="text-red-500 text-sm">{errors.proteinRange}</p>}
                    </div>

                    {/* Calories */}
                    <div>
                        <label className="block font-medium mb-2">Calories (per serving)</label>
                        <div className="flex space-x-4">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-1/2 p-2 border rounded"
                                value={nutritionValues.calories.min}
                                onChange={(e) => setNutritionValues({
                                    ...nutritionValues,
                                    calories: { ...nutritionValues.calories, min: e.target.value }
                                })}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-1/2 p-2 border rounded"
                                value={nutritionValues.calories.max}
                                onChange={(e) => setNutritionValues({
                                    ...nutritionValues,
                                    calories: { ...nutritionValues.calories, max: e.target.value }
                                })}
                            />
                        </div>
                        {errors.caloriesMin && <p className="text-red-500 text-sm">{errors.caloriesMin}</p>}
                        {errors.caloriesMax && <p className="text-red-500 text-sm">{errors.caloriesMax}</p>}
                        {errors.caloriesRange && <p className="text-red-500 text-sm">{errors.caloriesRange}</p>}
                    </div>

                    {/* Display total nutrients error if present */}
                    {errors.totalNutrients && (
                        <p className="text-red-500 font-medium">{errors.totalNutrients}</p>
                    )}

                    {errors.general && <p className="text-red-500">{errors.general}</p>}

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="w-1/2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FindYourMealModal;
