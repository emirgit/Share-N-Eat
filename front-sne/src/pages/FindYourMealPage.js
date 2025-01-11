import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosHelper from '../axiosHelper';

const FindYourMealPage = () => {
    const location = useLocation();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const nutritionValues = location.state?.nutritionValues || 
                                      JSON.parse(localStorage.getItem('mealSearchCriteria'));
                
                if (!nutritionValues) {
                    setError('No search criteria found');
                    setLoading(false);
                    return;
                }

                const response = await axiosHelper('/meals/search', 'POST', nutritionValues);
                setMeals(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching meals:', error);
                setError('Failed to fetch meals matching your criteria');
                setLoading(false);
            }
        };

        fetchMeals();
    }, [location.state]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Meals Matching Your Criteria</h1>
            {meals.length === 0 ? (
                <p>No meals found matching your criteria</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {meals.map(meal => (
                        <div key={meal.id} className="meal-card">
                            {/* Meal display logic */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FindYourMealPage;
