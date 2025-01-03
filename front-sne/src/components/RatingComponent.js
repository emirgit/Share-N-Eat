// src/components/RatingComponent.js
import React, { useState, useEffect } from 'react';
import ReactRating from 'react-rating';
import axiosHelper from '../axiosHelper';

/**
 * This component manages a single rating system (expert or regular) for a post.
 * 
 * Props:
 * - postId (number): Identifies which post is being rated.
 * - isExpertRating (boolean): Indicates if this rating is the "expert" one.
 * - isReadOnly (boolean): Controls whether the rating stars are interactive.
 * - initialAverage (number): The average rating for this category on mount.
 * - initialTotalRaters (number): The total number of raters for this category on mount.
 * - userRoles (array): Array of roles (e.g., ['ROLE_USER', 'ROLE_ADMIN']) for controlling UI logic.
 */
function RatingComponent({
  postId,
  isExpertRating,
  isReadOnly,
  initialAverage,
  initialTotalRaters,
  userRoles
}) {
  const [average, setAverage] = useState(initialAverage);
  const [totalRaters, setTotalRaters] = useState(initialTotalRaters);
  const [userRating, setUserRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(false);

  // On mount, fetch the user's existing rating (if any).
  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await axiosHelper(`/rates/current-user-rate/${postId}`, 'GET');
        setUserRating(response || 0);
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };
    fetchUserRating();
  }, [postId]);

  // Called when the user selects a rating.
  const handleRatingChange = async (newRating) => {
    if (loadingRating) return;
    setLoadingRating(true);

    try {
      // If the user selects the same rating again, remove the rating (DELETE).
      if (userRating === newRating) {
        await axiosHelper(`/rates/${postId}`, 'DELETE');
        setUserRating(0);
      } else {
        // Otherwise, submit the new rating (POST).
        const rateDto = { rating: newRating, postId };
        await axiosHelper('/rates', 'POST', rateDto);
        setUserRating(newRating);
      }

      // Fetch updated values from the server after rating changes.
      await fetchUpdatedAverages();
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('An error occurred while updating your rating. Please try again.');
    } finally {
      setLoadingRating(false);
    }
  };

  // Retrieves the updated average and total raters from the backend.
  const fetchUpdatedAverages = async () => {
    try {
      const updatedPost = await axiosHelper(`/posts/${postId}`, 'GET');
      setAverage(isExpertRating ? updatedPost.averageRateExpert : updatedPost.averageRateRegular);
      setTotalRaters(isExpertRating ? updatedPost.totalRatersExpert : updatedPost.totalRatersRegular);
    } catch (error) {
      console.error('Error fetching updated averages:', error);
    }
  };

  return (
    <div className="flex items-center mb-1">
      {/* ReactRating displays stars; color depends on expert vs. regular */}
      <ReactRating
        initialRating={average}
        readonly={isReadOnly}
        emptySymbol={<span className="text-gray-300 text-2xl">☆</span>}
        fullSymbol={
          isExpertRating
            ? <span className="text-green-500 text-2xl">★</span>
            : <span className="text-yellow-500 text-2xl">★</span>
        }
        fractions={2}
        onChange={(newRating) => {
          if (!isReadOnly) {
            handleRatingChange(newRating);
          }
        }}
      />

      {/* If readOnly is true, we show a lock icon for total raters. Otherwise, show normal text. */}
      {isReadOnly ? (
        <span className="ml-2 text-gray-400 text-sm flex items-center">
          <span className="mr-1">{totalRaters} rated</span> 🔒
        </span>
      ) : (
        <span className="ml-2 text-gray-500 text-sm">{totalRaters} rated</span>
      )}
    </div>
  );
}

export default RatingComponent;