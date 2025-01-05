// src/pages/MyProfilePage.js

import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import axiosHelper from '../axiosHelper';
import RecipeCard from '../components/RecipeCard';

function MyProfilePage({ currentUsername }) {
  const [user, setUser] = useState({
    username: '',
    role: '',
    bio: '',
    followers: 0,
    following: 0,
  });

  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newBio, setNewBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Posts-related state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(3); // Size set to 3 as requested
  const [hasMore, setHasMore] = useState(true);

  // Maps backend role to a user-friendly label
  const getDisplayRole = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Admin';
      case 'ROLE_EXPERT':
        return 'Expert';
      case 'ROLE_USER':
        return 'User';
      default:
        return 'Unknown Role';
    }
  };

  // Fetch profile data from /user/my-account
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const fetchedUser = await axiosHelper('/user/my-account', 'GET');
        const pictureResponse = await axiosHelper('/user/my-account/profile-picture', 'GET', null, {
          responseType: 'blob',
        });

        setUser({
          username: fetchedUser.username,
          role: fetchedUser.role,
          bio: fetchedUser.bio,
          followers: fetchedUser.followersCount,
          following: fetchedUser.followingCount,
        });
        setNewUsername(fetchedUser.username);
        setNewBio(fetchedUser.bio);

        setProfilePictureUrl(URL.createObjectURL(pictureResponse));
      } catch (err) {
        console.error('Error fetching user data', err);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch initial posts
  useEffect(() => {
    if (currentUsername) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUsername]);

  // Function to fetch posts
  const fetchPosts = async () => {
    try {
        setPostsLoading(true);
      const fetchedPosts = await axiosHelper(
        `/posts/current-user/range?page=${page}&size=${size}`,
        'GET'
      );
      // Append new posts to existing ones
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      // If the number of fetched posts is less than the requested size, there's no more data
      if (fetchedPosts.length < size) {
        setHasMore(false);
      }
      setPostsLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPostsError('Failed to load posts.');
      setPostsLoading(false);
    }
  };

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Fetch more posts when page changes
  useEffect(() => {
    if (page > 0) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      await axiosHelper('/user/my-account', 'PUT', {
        username: newUsername,
        bio: newBio,
      });
      setUser((prev) => ({
        ...prev,
        username: newUsername,
        bio: newBio,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving user data', err);
      setError('Failed to save changes.');
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profilePhoto', file);

        await axiosHelper('/user/my-account/upload-photo', 'PUT', formData, {
          'Content-Type': 'multipart/form-data',
        });

        setProfilePictureUrl(URL.createObjectURL(file));
      } catch (err) {
        console.error('Error uploading profile photo', err);
        setError('Failed to upload profile photo.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-row w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center p-8">
          {/* Profile Section */}
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8 mb-8 flex items-start">
            <div className="relative w-32 h-32 mr-6">
              <img
                src={profilePictureUrl || '/default-profile.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="text-2xl font-bold mr-4 border p-1 rounded"
                    />
                  ) : (
                    <div className="text-2xl font-bold mr-4">{user.username}</div>
                  )}
                  <div className="flex items-center text-gray-600 space-x-4">
                    <div>
                      <span className="font-semibold">{user.followers}</span> Followers
                    </div>
                    <div>
                      <span className="font-semibold">{user.following}</span> Following
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="text-gray-500 mt-1">{getDisplayRole(user.role)}</div>
              <div className="mt-4">
                {isEditing ? (
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="text-gray-700">{user.bio}</p>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Posts Section */}
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">Posts</h2>
            {postsError && <p className="text-center text-red-500">{postsError}</p>}

            <InfiniteScroll
              dataLength={posts.length}
              next={loadMorePosts}
              hasMore={hasMore}
              loader={<p className="text-center text-gray-500">Loading more posts...</p>}
              endMessage={<p className="text-center text-gray-500">No more new posts.</p>}
            >
              <div className="space-y-4">
                {posts.map((post) => (
                  <RecipeCard key={post.id} post={post} currentUsername={currentUsername} />
                ))}
              </div>
            </InfiniteScroll>

            {postsLoading && page === 0 && (
              <p className="text-center text-gray-500">Loading posts...</p>
            )}
            {!postsLoading && posts.length === 0 && (
              <p className="text-center text-gray-500">No posts available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;