// src/components/ProfileSwitch.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosHelper from '../axiosHelper';

import MyProfilePage from '../pages/MyProfilePage';
import UserProfilePage from '../pages/UserProfilePage';

function ProfileSwitch() {
  const { username } = useParams(); // May be undefined if the user visited /profile
  const [currentUsername, setCurrentUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUsername = async () => {
      try {
        const data = await axiosHelper('/user/my-account/username', 'GET');
        setCurrentUsername(data); 
      } catch (err) {
        setError('Failed to fetch current username.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUsername();
  }, []);

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

  // Decide whether to render MyProfilePage or UserProfilePage
  // If no username parameter or it matches the logged-in user's username,
  // then show MyProfilePage, otherwise show UserProfilePage.
  if (!username || username === currentUsername) {
    return <MyProfilePage currentUsername={currentUsername} />;
  } else {
    return <UserProfilePage currentUsername={currentUsername} viewUsername={username} />;
  }
}

export default ProfileSwitch;