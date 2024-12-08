// src/components/Comment.js
import React, { useState, useEffect } from 'react';
import axiosHelper from '../axiosHelper';
import profilePic from '../assets/profilepic-shrneat.png'; // Fallback profile picture

const Comment = ({ postId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posting, setPosting] = useState(false);

    // Fetch comments for the post
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const response = await axiosHelper(`/posts/${postId}/comments`, 'GET');
                setComments(response || []);
            } catch (err) {
                console.error('Error fetching comments:', err);
                setError('Failed to load comments.');
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    // Handle new comment submission
    const handleCommentSubmit = async () => {
        if (newComment.trim() === '') return;

        try {
            setPosting(true);
            const commentData = {
                postId,
                text: newComment,
                username: currentUser.username, // Assuming currentUser has a username field
            };

            await axiosHelper(`/posts/${postId}/comments`, 'POST', commentData);

            // Optionally, you can fetch comments again or append the new comment locally
            setComments([
                ...comments,
                {
                    user: {
                        name: currentUser.username,
                        profilePic: currentUser.profilePic || profilePic, // Use fallback if missing
                    },
                    text: newComment,
                },
            ]);
            setNewComment('');
        } catch (err) {
            console.error('Error posting comment:', err);
            setError('Failed to post comment.');
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="p-4 border-t border-gray-200">
            {/* New Comment Input */}
            <div className="flex items-center mb-4">
                <img
                    src={currentUser.profilePic || profilePic}
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
                    className={`ml-2 text-blue-500 font-medium ${posting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={posting}
                >
                    {posting ? 'Posting...' : 'Post'}
                </button>
            </div>

            {/* Display Errors */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Comments List */}
            {loading ? (
                <p className="text-gray-700">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-700">No comments yet. Be the first to comment!</p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment, index) => (
                        <div key={index} className="flex items-start space-x-2">
                            <img
                                src={comment.user.profilePic || profilePic}
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
            )}
        </div>
    );
};

export default Comment;
