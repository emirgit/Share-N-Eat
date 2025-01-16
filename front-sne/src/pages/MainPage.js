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
  const location = useLocation();

  const [fetchMode, setFetchMode] = useState('trendings');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 4;

  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState('');

  const scrollContainerRef = useRef(null);

  // Fetch the current username once
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const data = await axiosHelper('/user/my-account/username', 'GET');
        setCurrentUsername(data);
      } catch (err) {
        console.error('Error fetching username:', err);
        setUsernameError('Failed to load username.');
      } finally {
        setUsernameLoading(false);
      }
    };
    fetchUsername();
  }, []);

  // On any location.search change, reset pagination & posts, set fetchMode
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setError(null);

    const params = new URLSearchParams(location.search);
    const mode = params.get('fetchMode') || 'trendings'; // Defaults to 'trendings'
    setFetchMode(mode);
  }, [location.search]);

  // Fetch posts whenever fetchMode or page changes (and username is loaded/no error)
  useEffect(() => {
    if (usernameLoading || usernameError) return;

    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams(location.search);
        let endpoint;

        if (fetchMode === 'followings') {
          endpoint = `/posts/current-user/followings?page=${page}&size=${pageSize}`;
        } else if (fetchMode === 'findMeal') {
          // Construct the query for "find meal"
          const findMealParams = new URLSearchParams();
          findMealParams.append('page', page);
          findMealParams.append('size', pageSize);

          // Possibly read other filters from location.search
          const filterParams = [
            'minCarbs', 'maxCarbs',
            'minFat', 'maxFat',
            'minProtein', 'maxProtein',
            'minCalories', 'maxCalories'
          ];
          filterParams.forEach(param => {
            const value = params.get(param);
            if (value) {
              findMealParams.append(param, value);
            }
          });

          endpoint = `/posts/find-your-meal?${findMealParams.toString()}`;
        } else {
          endpoint = `/posts/current-user/trendings?page=${page}&size=${pageSize}`;
        }

        const response = await axiosHelper(endpoint, 'GET');
        const fetchedPosts = response.content || response;

        setPosts(prev => [...prev, ...fetchedPosts]);

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

    fetchPosts();
  }, [fetchMode, page, usernameLoading, usernameError, location.search]);

  // Optionally scroll to top on each fetchMode change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [fetchMode]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-row">
        <Sidebar />

        <div className="flex-1 flex flex-col" ref={scrollContainerRef}>
          <UploadSection />

          {usernameLoading && (
            <p className="text-center text-gray-500 mt-4">
              Loading user data...
            </p>
          )}

          {usernameError && (
            <p className="text-center text-red-500 mt-4">
              {usernameError}
            </p>
          )}

          {error && (
            <p className="text-center text-red-500 mt-4">
              {error}
            </p>
          )}

          {!usernameLoading &&
            !usernameError &&
            posts.length === 0 &&
            !hasMore && (
              <p className="text-center text-gray-500 mt-4">
                No posts available.
              </p>
            )}

          {!usernameLoading &&
            !usernameError &&
            posts.length > 0 && (
              <InfiniteScroll
                dataLength={posts.length}
                next={() => setPage(prev => prev + 1)}
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
                  {posts.map(post => (
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
