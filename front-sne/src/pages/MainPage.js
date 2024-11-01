import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecipeCard from '../components/RecipeCard';
import UploadSection from '../components/UploadSection';
import ramenImg from '../assets/ramen.jpeg';
import userImg from '../assets/profilepic-shrneat.png'


const MainPage = () => {
    const sampleUser1 = {
        profilePic: userImg,
        name: 'QualifiedUser',
        followStatus: 'Qualified',
        isQualified: true
    };

    const sampleRecipe1 = {
        image: ramenImg,
        title: 'A Bowl of Ramen',
        protein: 13,
        carbs: 26,
        fat: 5,
        likes: 12,
        comments: 4,
        calories: 560
    };

    const sampleRecipe2 = {
        image: ramenImg,
        title: 'Fresh Salad Bowl',
        protein: 8,
        carbs: 12,
        fat: 4,
        likes: 8,
        comments: 3,
        calories: 220
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Main Content with Sidebar and Feed */}
            <div className="flex flex-row">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Feed */}
                <div className="flex-1 flex flex-col">
                    {/* Upload Section */}
                    <UploadSection />

                    {/* Feed Section */}
                    <div className="flex justify-center mt-4">
                        <div className="w-full max-w-4xl">
                            <RecipeCard user={sampleUser1} recipe={sampleRecipe1} />
                            <RecipeCard user={sampleUser1} recipe={sampleRecipe2} />
                            {/* Add more RecipeCard components as needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;