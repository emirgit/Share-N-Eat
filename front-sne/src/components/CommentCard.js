// src/components/CommentCard.js
import React, { useState, useEffect } from 'react';
import axiosHelper from '../axiosHelper';

const CommentCard = ({ comment, postId, isOwner, onCommentChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axiosHelper(
                    `/user/${comment.userName}/profile-picture`,
                    'GET',
                    null,
                    { responseType: 'blob' }
                );
                setProfileImage(URL.createObjectURL(response));
            } catch (error) {
                console.error(`Error fetching profile image for ${comment.userName}`, error);
            }
        };

        if (comment.userName) {
            fetchProfileImage();
        }
    }, [comment.userName]);

    const handleUpdateComment = async () => {
        try {
            await axiosHelper(`/comments/${comment.id}`, 'PUT', {
                text: editText,
                postId: postId,
                userName: comment.userName,
            });

            // After updating, stop editing and refetch comments
            setIsEditing(false);
            if (onCommentChange) {
                onCommentChange();
            }
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };

    const handleDeleteComment = async () => {
        try {
            await axiosHelper(`/comments/${comment.id}`, 'DELETE');
            // After deleting, refetch comments
            if (onCommentChange) {
                onCommentChange();
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
        <div className="flex items-start space-x-2">
            {profileImage && (
                <img
                    src={profileImage}
                    alt={comment.userName}
                    className="w-8 h-8 rounded-full"
                />
            )}
            <div className="text-sm text-gray-700 flex-1">
                <span className="font-medium">{comment.userName}: </span>
                {isEditing ? (
                    <div className="flex flex-col space-y-2">
                        <input
                            type="text"
                            className="border p-1 rounded"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={handleUpdateComment}
                                className="text-green-500 font-medium"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditText(comment.text);
                                }}
                                className="text-gray-500 font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <span>{comment.text}</span>
                )}
            </div>
            {isOwner && !isEditing && (
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-500 font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDeleteComment}
                        className="text-red-500 font-medium"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentCard;
