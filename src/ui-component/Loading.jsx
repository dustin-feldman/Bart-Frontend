// components/Loading.js
import React from 'react';
import { useSelector } from 'react-redux';

const Loading = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="loading-backdrop">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;
