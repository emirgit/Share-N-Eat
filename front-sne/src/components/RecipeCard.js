import React, { useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import profilePic from '../assets/profilepic-shrneat.png';
const Star = ({ color }) => (
    <svg
        className={`w-5 h-5 ${color}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.971a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.375 2.453a1 1 0 00-.364 1.118l1.286 3.971c.3.921-.755 1.688-1.54 1.118l-3.375-2.453a1 1 0 00-1.175 0l-3.375 2.453c-.784.57-1.84-.197-1.54-1.118l1.286-3.971a1 1 0 00-.364-1.118L2.58 9.398c-.784-.57-.381-1.81.588-1.81h4.172a1 1 0 00.95-.69l1.286-3.971z" />
    </svg>
);

const COLORS = ['#fbbf24', '#8b0000', '#3b82f6'];

const RecipeCard = ({ user, recipe }) => {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([
        {
            user: {
                name: 'Alice',
                profilePic: {profilePic},
            },
            text: 'This looks delicious!',
        },
        {
            user: {
                name: 'Bob',
                profilePic: {profilePic},
            },
            text: 'Can’t wait to try it!',
        },
        {
            user: {
                name: 'Charlie',
                profilePic: {profilePic},
            },
            text: 'Great recipe, thanks for sharing!',
        },
    ]);

    const pieData = [
        { name: 'Fat', value: recipe.fat },
        { name: 'Protein', value: recipe.protein },
        { name: 'Carbs', value: recipe.carbs },
    ];

    const handleCommentSubmit = () => {
        if (newComment.trim() !== '') {
            setComments([
                ...comments,
                {
                    user: {
                        name: user.name,
                        profilePic: user.profilePic,
                    },
                    text: newComment,
                },
            ]);
            setNewComment('');
        }
    };

    return (
        <div className="bg-white shadow-md rounded-3xl overflow-hidden mb-6 max-w-4xl">
            {/* User Info */}
            <div className="flex items-center p-4 border-b border-gray-200">
                <img
                    src={user.profilePic}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                />
                <div className="ml-3 flex-1">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.followStatus}</div>
                </div>
                <button className="text-blue-500">Follow</button>
            </div>

            {/* Description Section */}
            <div className="p-4 text-gray-700">
                <p>{recipe.description || 'This is a delicious recipe that you will love. Try it out and enjoy the flavors!'}</p>
            </div>

            {/* Recipe Image */}
            <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover"
            />

            {/* Recipe Details with Stars, Pie Chart, and Macros */}
            <div className="p-4 flex items-center">
                <div className="flex flex-col items-start mr-4">
                    <div className="flex mb-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} color="text-blue-500" />
                        ))}
                    </div>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} color="text-yellow-500" />
                        ))}
                    </div>
                </div>
                <PieChart width={80} height={80} className="mx-4">
                    <Pie
                        data={pieData}
                        dataKey="value"
                        outerRadius={35}
                        innerRadius={15}
                        paddingAngle={2}
                        isAnimationActive={false}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
                <div className="flex flex-col ml-4 text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                        <span>🍗</span> <span className="ml-1">{recipe.protein}g protein</span>
                    </div>
                    <div className="flex items-center mb-1">
                        <span>🍞</span> <span className="ml-1">{recipe.carbs}g carbs</span>
                    </div>
                    <div className="flex items-center mb-1">
                        <span>🥓</span> <span className="ml-1">{recipe.fat}g fat</span>
                    </div>
                    <div className="mt-2 text-center">{recipe.calories} kcal</div>
                </div>
            </div>

            {/* Interactions */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div className="flex space-x-4">
                    <button>👍 {recipe.likes}</button>
                    <button onClick={() => setIsCommentsOpen(!isCommentsOpen)}>💬 {recipe.comments}</button>
                </div>
                <button className="text-blue-500">Share</button>
            </div>

            {/* Comments Section */}
            {isCommentsOpen && (
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                        <img
                            src={user.profilePic}
                            alt="User"
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 border rounded-full p-2 text-sm focus:outline-none"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className="ml-2 text-blue-500 font-medium"
                        >
                            Post
                        </button>
                    </div>
                    <div className="space-y-4">
                        {comments.map((comment, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <img
                                    src={comment.user.profilePic}
                                    alt={comment.user.name}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div className="text-sm text-gray-700">
                                    <span className="font-medium">{comment.user.name}: </span>
                                    {comment.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeCard;
