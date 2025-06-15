/**
 * Utility functions for image handling and optimization
 */

/**
 * Optimizes Cloudinary image URLs with transformation parameters
 * @param {string} url - Original image URL
 * @param {object} options - Transformation options
 * @returns {string|null} - Optimized URL or null if invalid
 */
export const getOptimizedCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Check if it's a Cloudinary URL
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width = 800,
    height = 450,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto'
  } = options;

  try {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transformations = [
        `f_${format}`,
        `q_${quality}`,
        `w_${width}`,
        `h_${height}`,
        `c_${crop}`,
        `g_${gravity}`
      ].join(',');

      return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }
  } catch (error) {
    console.error('Error optimizing Cloudinary URL:', error);
  }

  return url;
};

/**
 * Gets optimized avatar image URL
 * @param {string} url - Original image URL
 * @returns {string|null} - Optimized avatar URL
 */
export const getOptimizedAvatarUrl = (url) => {
  return getOptimizedCloudinaryUrl(url, {
    width: 64,
    height: 64,
    crop: 'fill',
    gravity: 'face'
  });
};

/**
 * Gets optimized blog image URL
 * @param {string} url - Original image URL
 * @returns {string|null} - Optimized blog image URL
 */
export const getOptimizedBlogImageUrl = (url) => {
  return getOptimizedCloudinaryUrl(url, {
    width: 800,
    height: 450,
    crop: 'fill',
    gravity: 'auto'
  });
};

/**
 * Preloads an image to check if it's accessible
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} - Promise that resolves to true if image loads successfully
 */
export const preloadImage = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;

    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000);
  });
};

/**
 * Creates a fallback image data URL for broken images
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display
 * @returns {string} - Data URL for fallback image
 */
export const createFallbackImage = (width = 400, height = 300, text = 'Image not available') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = '#6b7280';
  ctx.font = '16px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL();
};
