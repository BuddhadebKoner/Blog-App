import React, { useState, useCallback } from 'react';
import { getOptimizedCloudinaryUrl, preloadImage } from '../lib/imageUtils';

/**
 * Optimized Image component with error handling and Cloudinary optimization
 */
const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError,
  fallbackText = 'Image not available',
  optimizationOptions = {},
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const optimizedSrc = getOptimizedCloudinaryUrl(src, {
    width,
    height,
    ...optimizationOptions
  });

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setImageError(false);
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setImageError(true);
    onError?.();
  }, [onError]);

  if (!src || imageError) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ${className}`}
        style={{ width, height }}
        {...props}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm text-center px-2">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={optimizedSrc || src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ width, height }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
