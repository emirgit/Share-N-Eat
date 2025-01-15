// src/pages/MainPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecipeCard from '../components/RecipeCard';
import UploadSection from '../components/UploadSection';
import axiosHelper from '../axiosHelper';
import InfiniteScroll from 'react-infinite-scroll-component';

const MainPage = () => {
  // --------------------------------------------
  // 1) Read `fetchMode` from the URL query param
  // --------------------------------------------
  const location = useLocation();
  const [fetchMode, setFetchMode] = useState('trendings');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('fetchMode');

    if (mode === 'followings') {
      setFetchMode('followings');
    } else if (mode === 'findMeal') {
      setFetchMode('findMeal');
    } else {
      setFetchMode('trendings');
    }
  }, [location.search]);

  // --------------------------------------------
  // 2) Other state
  // --------------------------------------------
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState('');

  // Pagination
  const pageSize = 4;
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Scroll container ref
  const scrollContainerRef = useRef(null);

  // --------------------------------------------
  // 3) Fetch current user's username
  // --------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const data = await axiosHelper('/user/my-account/username', 'GET');
        setCurrentUsername(data);
      } catch (err) {
        console.error('Error fetching username:', err);
        setUsernameError('Failed to load username.');
      } finally {
        setUsernameLoading(false);
      }
    })();
  }, []);

  // --------------------------------------------
  // 4) Reset posts/page/hasMore on fetchMode or user load
  // --------------------------------------------
  useEffect(() => {
    if (!usernameError && !usernameLoading) {
      setPosts([]);
      setPage(0);
      setHasMore(true);
    }
  }, [fetchMode, usernameError, usernameLoading]);

  // --------------------------------------------
  // 5) Fetch new data whenever page changes
  // --------------------------------------------
  useEffect(() => {
    if (!usernameError && !usernameLoading) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, fetchMode, usernameError, usernameLoading]);

  // --------------------------------------------
  // 6) Scroll to top whenever fetchMode changes
  // --------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0); // immediate scroll to top
  }, [fetchMode]);

  // --------------------------------------------
  // 7) fetchPosts
  // --------------------------------------------
  const fetchPosts = async () => {
    try {
      let endpoint;
      let method = 'GET';
      let body = null;
      let headers = undefined;

      // We'll parse the query from location.search
      const searchParams = new URLSearchParams(location.search);

      if (fetchMode === 'followings') {
        endpoint = `/posts/current-user/followings?page=${page}&size=${pageSize}`;
      } else if (fetchMode === 'findMeal') {
        // We'll POST to /posts/find-your-meal with FormData
        endpoint = `/posts/find-your-meal?page=${page}&size=${pageSize}`;
        method = 'POST';

        // Build FormData for the model attribute
        const formData = new FormData();

        if (searchParams.get('minCarbs') !== null) {
          formData.append('minCarbs', searchParams.get('minCarbs'));
        }
        if (searchParams.get('maxCarbs') !== null) {
          formData.append('maxCarbs', searchParams.get('maxCarbs'));
        }

        if (searchParams.get('minFat') !== null) {
          formData.append('minFat', searchParams.get('minFat'));
        }
        if (searchParams.get('maxFat') !== null) {
          formData.append('maxFat', searchParams.get('maxFat'));
        }

        if (searchParams.get('minProtein') !== null) {
          formData.append('minProtein', searchParams.get('minProtein'));
        }
        if (searchParams.get('maxProtein') !== null) {
          formData.append('maxProtein', searchParams.get('maxProtein'));
        }

        if (searchParams.get('minCalories') !== null) {
          formData.append('minCalories', searchParams.get('minCalories'));
        }
        if (searchParams.get('maxCalories') !== null) {
          formData.append('maxCalories', searchParams.get('maxCalories'));
        }

        body = formData;
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        // default: "trendings"
        endpoint = `/posts/current-user/trendings?page=${page}&size=${pageSize}`;
      }

      // Call axiosHelper
      const response = await axiosHelper(endpoint, method, body, headers);
      const fetchedPosts = response.content || response;

      // Append new posts
      setPosts((prev) => [...prev, ...fetchedPosts]);

      // Check if there's more data
      if (response.totalPages !== undefined) {
        setHasMore(page + 1 < response.totalPages);
      } else {
        setHasMore(fetchedPosts.length > 0);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
      setHasMore(false);
    }
  };

  // --------------------------------------------
  // 8) Render
  // --------------------------------------------
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex flex-row">
        <Sidebar />

        {/* Main feed area */}
        <div className="flex-1 flex flex-col" ref={scrollContainerRef}>
          {/* Upload Section */}
          <UploadSection />

          {/* Loading user data */}
          {usernameLoading && (
            <p className="text-center text-gray-500 mt-4">
              Loading user data...
            </p>
          )}

          {/* Username error */}
          {usernameError && (
            <p className="text-center text-red-500 mt-4">
              {usernameError}
            </p>
          )}

          {/* General posts error */}
          {error && (
            <p className="text-center text-red-500 mt-4">{error}</p>
          )}

          {/* If no posts and no more pages => "No posts available" */}
          {!usernameLoading &&
            !usernameError &&
            posts.length === 0 &&
            !hasMore && (
              <p className="text-center text-gray-500 mt-4">
                No posts available.
              </p>
            )}

          {/* Feed Section */}
          {!usernameLoading && !usernameError && posts.length > 0 && (
            <InfiniteScroll
              key={fetchMode}
              dataLength={posts.length}
              next={() => setPage((prev) => prev + 1)}
              hasMore={hasMore}
              loader={
                <p className="text-center text-gray-500 mt-4">
                  Loading more posts...
                </p>
              }
              endMessage={
                <p className="text-center text-gray-500 mt-4">
                  You have seen all posts.
                </p>
              }
              className="w-full flex flex-col items-center mt-4"
            >
              <div className="w-full max-w-4xl">
                {posts.map((post) => (
                  <RecipeCard
                    key={post.postId}
                    post={post}
                    currentUsername={currentUsername}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
