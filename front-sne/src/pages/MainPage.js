// src/pages/MainPage.js

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecipeCard from '../components/RecipeCard';
import UploadSection from '../components/UploadSection';
import axiosHelper from '../axiosHelper';
import InfiniteScroll from 'react-infinite-scroll-component';

const MainPage = () => {
  // --------------------------------------------
  // State
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

  // Which endpoint mode are we using? ("trendings" or "followings")
  const [fetchMode, setFetchMode] = useState('trendings');

  // Refresh counter
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Scroll container ref
  const scrollContainerRef = useRef(null);

  // --------------------------------------------
  // Fetch current user's username
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
  // Effect A: Reset when fetchMode or refreshCounter changes
  // --------------------------------------------
  useEffect(() => {
    if (!usernameError && !usernameLoading) {
      // 1) Clear old posts
      setPosts([]);
      // 2) Reset page
      setPage(0);
      // 3) Reset hasMore
      setHasMore(true);
    }
  }, [fetchMode, refreshCounter, usernameError, usernameLoading]);

  // --------------------------------------------
  // Effect B: Whenever the page, fetchMode, or refreshCounter changes, fetch new data
  // --------------------------------------------
  useEffect(() => {
    if (!usernameError && !usernameLoading) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, fetchMode, refreshCounter, usernameError, usernameLoading]);

  // --------------------------------------------
  // Scroll to top whenever fetchMode or refreshCounter changes
  // --------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0); // Immediate scroll to top
  }, [fetchMode, refreshCounter]);

  // --------------------------------------------
  // fetchPosts - uses current page & fetchMode
  // --------------------------------------------
  const fetchPosts = async () => {
    try {
      let endpoint;

      if (fetchMode === 'followings') {
        endpoint = '/posts/current-user/followings';
      } else {
        // Default to "trendings" or "home"
        endpoint = '/posts/current-user/trendings';
      }

      const response = await axiosHelper(
        `${endpoint}?page=${page}&size=${pageSize}`,
        'GET'
      );

      const fetchedPosts = response.content || response;

      // Append the new posts to our existing array
      setPosts((prev) => [...prev, ...fetchedPosts]);

      // If your backend provides totalPages
      if (response.totalPages !== undefined) {
        setHasMore(page + 1 < response.totalPages);
      } else {
        // If no totalPages, you'll need another approach for "hasMore"
        // e.g. check if fetchedPosts.length < pageSize
        setHasMore(fetchedPosts.length > 0);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
      setHasMore(false);
    }
  };

  // --------------------------------------------
  // Handle Refresh
  // --------------------------------------------
  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  // --------------------------------------------
  // Render
  // --------------------------------------------
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex flex-row">
        {/* Sidebar - pass down setFetchMode and handleRefresh */}
        <Sidebar
          setFetchMode={setFetchMode}
          onRefresh={handleRefresh}
          currentFetchMode={fetchMode}
        />

        {/* Main feed area */}
        <div className="flex-1 flex flex-col" ref={scrollContainerRef}>
          {/* Upload Section */}
          <UploadSection />

          {/* Loading username */}
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

          {/* If no posts and no more pages, show "No posts available" */}
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
              key={`${fetchMode}-${refreshCounter}`} // Added key prop
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
