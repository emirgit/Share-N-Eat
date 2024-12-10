// src/components/Comment.js
import React, { useState, useEffect, useCallback } from 'react';
import axiosHelper from '../axiosHelper';
import CommentCard from './CommentCard';

const Comment = ({ postId, username }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posting, setPosting] = useState(false);
    const [currentUserProfilePic, setCurrentUserProfilePic] = useState(null);

    const fetchComments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosHelper(`/comments/${postId}`, 'GET');
            const fetchedComments = response || [];
            // Enhance each comment with an isOwner flag after fetching
            const enrichedComments = fetchedComments.map((comment) => ({
                
                ...comment,
                isOwner: comment.userName === username,
            }));

            setComments(enrichedComments);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Failed to load comments.');
        } finally {
            setLoading(false);
        }
    }, [postId, username]);

    // Fetch current user's profile picture
    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const profilePictureResponse = await axiosHelper('/user/my-account/profile-picture', 'GET', null, {
                    responseType: 'blob',
                });
                setCurrentUserProfilePic(URL.createObjectURL(profilePictureResponse));
            } catch (error) {
                console.error("Failed to fetch current user's profile picture", error);
            }
        };

        fetchProfilePicture();
    }, []);

    // Initial comments fetch
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleCommentSubmit = async () => {
        if (newComment.trim() === '') return;

        try {
            setPosting(true);
            const commentData = {
                postId,
                text: newComment,
                userName: username
            };

            await axiosHelper('/comments', 'POST', commentData);

            // After posting a new comment, refetch the updated list
            setNewComment('');
            fetchComments();
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
                {currentUserProfilePic && (
                    <img
                        src={currentUserProfilePic}
                        alt="User"
                        className="w-8 h-8 rounded-full mr-2"
                    />
                )}
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
                    {comments.map((comment) => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            isOwner={comment.isOwner}
                            onCommentChange={fetchComments}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
