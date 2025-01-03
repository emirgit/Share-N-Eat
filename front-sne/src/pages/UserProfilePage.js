// src/pages/UserProfilePage.js

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosHelper from '../axiosHelper';
import RecipeCard from '../components/RecipeCard';
import InfiniteScroll from 'react-infinite-scroll-component';

function UserProfilePage({ currentUsername, viewUsername }) {
  // The user being viewed
  const [user, setUser] = useState({
    username: '',
    role: '',
    bio: '',
    followers: 0,
    following: 0,
  });

  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Follow/Unfollow states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Pagination-related state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(3); // Adjust size as needed
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

  // Fetches user data from /user/:viewUsername
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const fetchedUser = await axiosHelper(`/user/${viewUsername}`, 'GET');
        const pictureResponse = await axiosHelper(
          `/user/${viewUsername}/profile-picture`,
          'GET',
          null,
          {
            responseType: 'blob',
          }
        );

        setUser({
          username: fetchedUser.username,
          role: fetchedUser.role,
          bio: fetchedUser.bio,
          followers: fetchedUser.followersCount,
          following: fetchedUser.followingCount,
        });

        setProfilePictureUrl(URL.createObjectURL(pictureResponse));

        // Check if the current user is following this user
        const followingStatus = await axiosHelper(
          `/follows/current-user/${viewUsername}/is-following`,
          'GET'
        );
        setIsFollowing(followingStatus);
      } catch (err) {
        console.error('Error fetching user data', err);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    if (viewUsername) {
      fetchUserData();
    }
  }, [viewUsername]);

  // Fetch posts function
  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const fetchedPosts = await axiosHelper(
        `/posts/by-user/${viewUsername}/range?page=${page}&size=${size}`,
        'GET'
      );
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      if (fetchedPosts.length < size) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setPostsLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPostsError('Failed to load posts.');
      setPostsLoading(false);
    }
  };

  // Fetch posts when page or viewUsername changes
  useEffect(() => {
    if (viewUsername) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, viewUsername]);

  // Reset posts when viewUsername changes
  useEffect(() => {
    setPage(0);
    setPosts([]);
    setHasMore(true);
  }, [viewUsername]);

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Follow/Unfollow logic
  const handleFollowToggle = async () => {
    if (followLoading) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await axiosHelper('/follows/unfollow', 'DELETE', {
          followerUsername: currentUsername,
          followedUsername: user.username,
        });
        setIsFollowing(false);
        setUser((prev) => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        // Follow
        await axiosHelper('/follows/follow', 'POST', {
          followerUsername: currentUsername,
          followedUsername: user.username,
        });
        setIsFollowing(true);
        setUser((prev) => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (err) {
      console.error('Error toggling follow status', err);
      setError('Failed to update follow status.');
    } finally {
      setFollowLoading(false);
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
              {/* No camera overlay since this is another user's profile */}
            </div>
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-4">{user.username}</div>
                  <div className="flex items-center text-gray-600 space-x-4">
                    <div>
                      <span className="font-semibold">{user.followers}</span> Followers
                    </div>
                    <div>
                      <span className="font-semibold">{user.following}</span> Following
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleFollowToggle}
                  className={`px-4 py-2 rounded-lg ${
                    isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                  }`}
                  disabled={followLoading}
                >
                  {followLoading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
              <div className="text-gray-500 mt-1">{getDisplayRole(user.role)}</div>
              <div className="mt-4">
                <p className="text-gray-700">{user.bio}</p>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">Posts</h2>
            {postsError && <p className="text-center text-red-500">{postsError}</p>}

            {posts.length > 0 ? (
              <InfiniteScroll
                dataLength={posts.length}
                next={loadMorePosts}
                hasMore={hasMore}
                loader={<p className="text-center text-gray-500">Loading more posts...</p>}
                endMessage={<p className="text-center text-gray-500">No more posts available.</p>}
              >
                <div className="space-y-4">
                  {posts.map((post) => (
                    <RecipeCard
                      key={post.id}
                      post={post}
                      currentUsername={currentUsername}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            ) : (
              !postsLoading && (
                <p className="text-center text-gray-500">No posts available.</p>
              )
            )}

            {postsLoading && page === 0 && (
              <p className="text-center text-gray-500">Loading posts...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;