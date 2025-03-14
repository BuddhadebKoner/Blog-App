import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUpdateUser } from '../../lib/react-query/queriesAndMutation';
import { LoaderCircle, User, Mail, Calendar, CheckCircle, X, ShieldQuestion, Upload, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { uploadImage } from '../../lib/api/auth.api';

// Get environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

// Validate required environment variables
if (!CLOUDINARY_CLOUD_NAME) {
  console.error('Missing VITE_CLOUDINARY_CLOUD_NAME environment variable');
}

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME
  }
});

const Settings = () => {
  const { isAuthenticated, isAuthenticatedLoading, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageId, setImageId] = useState('');
  const [userData, setUserData] = useState(null);
  const [formChanged, setFormChanged] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  const updateUserMutation = useUpdateUser();

  // Initialize user data
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPreviewImage(currentUser.imageUrl || '');
      setImageUrl(currentUser.imageUrl || '');
      setImageId(currentUser.imageId || '');
      setUserData(currentUser);
      setFormChanged(false);
      setFileSelected(false);
    }
  }, [currentUser]);

  // Check if form has changed
  useEffect(() => {
    if (userData) {
      setFormChanged(
        name !== userData.name ||
        (fileSelected && imageUrl !== userData.imageUrl)
      );
    }
  }, [name, fileSelected, userData, imageUrl]);

  // Handle file selection and upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileSelected(false);
      return;
    }

    try {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (JPEG, PNG, etc.)');
        setFileSelected(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file is too large (max 5MB)');
        setFileSelected(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Preview image locally first
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFileSelected(true);
      };
      reader.onerror = () => {
        toast.error("Couldn't load image preview");
        setFileSelected(false);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      await uploadToCloudinary(file);

    } catch (error) {
      console.error('File processing error:', error);
      toast.error("Couldn't process image file");
      setFileSelected(false);
    }
  };

  // Upload to Cloudinary function
  const uploadToCloudinary = async (file) => {
    setUploadingImage(true);

    const path = 'mern-blog/profiles'

    try {
      const result = await uploadImage(file, path);

      if (!result.success) {
        throw new Error(result.message || 'Failed to upload image');
      }

      // Store the Cloudinary URL and public_id
      setImageUrl(result.imageUrl);
      setImageId(result.imageId);

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      // Reset the file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setUploadingImage(false);
    }
  };

  // Reset the form
  const handleReset = useCallback(() => {
    setName(userData?.name || '');
    setPreviewImage(userData?.imageUrl || '');
    setImageUrl(userData?.imageUrl || '');
    setImageId(userData?.imageId || '');
    setFileSelected(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [userData]);

  // Format date safely
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if form has changed
    if (!formChanged) {
      toast.info('No changes to update');
      return;
    }

    // Validate name
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (name.trim().length > 50) {
      toast.error('Name cannot exceed 50 characters');
      return;
    }

    setLoading(true);

    try {
      // Only add if user exists
      if (!userData || !userData._id) {
        toast.error('User data is missing');
        throw new Error('User data is missing');
      }

      // Create data object for API request (no longer FormData)
      const updateData = {
        userID: userData._id,
        name: name.trim(),
        imageUrl,
        imageId
      };

      // Update user with JSON data
      await updateUserMutation.mutateAsync(updateData);
      toast.success('Profile updated successfully');
      setFormChanged(false);
      setFileSelected(false);
    } catch (error) {
      console.error('Update failed:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Couldn't update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isAuthenticatedLoading) {
    return (
      <div className='flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 dark:border-[var(--color-border-dark)]'>
        <LoaderCircle className='animate-spin w-10 h-10' />
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className='flex gap-5 justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 dark:border-[var(--color-border-dark)]'>
        <ShieldQuestion className='w-10 h-10' />
        <p>
          Please{" "}
          <Link
            to={'/sign-in'}
            className='text-blue-500 hover:underline'>
            Sign In
          </Link>
          {" "}or{" "}
          <Link
            to={'/sign-up'}
            className='text-blue-500 hover:underline'
          >
            Sign Up
          </Link>
          {" "}to view this page
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile Settings - Blog</title>
      </Helmet>

      <div className="w-full h-fit overflow-auto bg-transparent text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] max-w-3xl mx-auto p-3 sm:p-4 md:p-6">
        <h1 className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-xl sm:text-2xl font-bold mb-4 md:mb-6">
          Profile Settings
        </h1>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {/* Left column - Profile Image */}
          <div className="md:col-span-1">
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] p-3 sm:p-4 rounded-lg border">
                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                  <div className="border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-2 relative">
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <RefreshCw className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    )}
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                        onError={() => {
                          setPreviewImage('');
                          toast.error("Couldn't load image preview");
                        }}
                      />
                    ) : userData?.imageUrl ? (
                      <img
                        src={userData.imageUrl}
                        alt={userData.name || 'User'}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Set a default image or initial
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="bg-[var(--color-surface-light)] text-[var(--color-text-primary-light)] dark:bg-[var(--color-surface-dark)] dark:text-[var(--color-text-primary-dark)] h-full w-full flex items-center justify-center font-bold text-4xl">
                        {userData?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <h2 className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-lg sm:text-xl font-semibold">
                    {userData?.name || 'User'}
                  </h2>
                  <div className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-xs sm:text-sm text-center">
                    Member since {formatDate(userData?.createdAt)}
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    {userData?.isVarified ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle size={14} className="mr-1" />
                        <span>Verified Account</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <X size={14} className="mr-1" />
                        <span>Not Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div className="md:col-span-2">
            <div className="bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] p-4 sm:p-5 md:p-6 rounded-lg border">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                <h2 className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Edit Profile
                </h2>

                {/* Profile Image Upload */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] block text-xs sm:text-sm font-medium">
                    Profile Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-xs sm:text-sm w-full p-1.5 sm:p-2 border rounded-md"
                      disabled={uploadingImage}
                    />
                    {uploadingImage && (
                      <div className="absolute right-2 top-2">
                        <Upload className="animate-pulse w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">
                    {uploadingImage
                      ? 'Uploading to Cloudinary...'
                      : imageUrl && fileSelected
                        ? 'Image uploaded successfully'
                        : 'Recommended: Square image, max 5MB'}
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-1 sm:space-y-2">
                  <label
                    htmlFor="name"
                    className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] block text-xs sm:text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-[var(--color-text-primary-light)] bg-[var(--color-background-light)] border-[var(--color-border-light)] dark:text-[var(--color-text-primary-dark)] dark:bg-[var(--color-background-dark)] dark:border-[var(--color-border-dark)] w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>

                {/* Email (non-editable) */}
                <div className="space-y-1 sm:space-y-2">
                  <label
                    htmlFor="email"
                    className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] flex items-center text-xs sm:text-sm font-medium"
                  >
                    <Mail size={14} className="mr-1" /> Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={userData?.email || ''}
                    className="text-[var(--color-text-secondary-light)] bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:text-[var(--color-text-secondary-dark)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* User ID (non-editable) */}
                <div className="space-y-1 sm:space-y-2">
                  <label
                    htmlFor="userId"
                    className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] flex items-center text-xs sm:text-sm font-medium"
                  >
                    <User size={14} className="mr-1" /> User ID
                  </label>
                  <input
                    id="userId"
                    type="text"
                    value={userData?._id || ''}
                    className="text-[var(--color-text-secondary-light)] bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:text-[var(--color-text-secondary-dark)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md cursor-not-allowed truncate"
                    disabled
                  />
                </div>

                {/* Last Updated (non-editable) */}
                <div className="space-y-1 sm:space-y-2">
                  <label
                    htmlFor="lastUpdated"
                    className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] flex items-center text-xs sm:text-sm font-medium"
                  >
                    <Calendar size={14} className="mr-1" /> Last Updated
                  </label>
                  <input
                    id="lastUpdated"
                    type="text"
                    value={formatDate(userData?.updatedAt)}
                    className="text-[var(--color-text-secondary-light)] bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:text-[var(--color-text-secondary-dark)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 sm:space-x-4 pt-2 sm:pt-4">
                  <button
                    type="submit"
                    disabled={loading || uploadingImage || updateUserMutation.isPending || !formChanged}
                    className={`${loading || uploadingImage || !formChanged || updateUserMutation.isPending
                      ? 'bg-[var(--color-button-disabled-light)] text-[var(--color-button-disabled-text-light)] dark:bg-[var(--color-button-disabled-dark)] dark:text-[var(--color-button-disabled-text-dark)] cursor-not-allowed'
                      : 'bg-[var(--color-button-primary-light)] text-[var(--color-button-primary-text-light)] hover:bg-[var(--color-button-primary-hover-light)] dark:bg-[var(--color-button-primary-dark)] dark:text-[var(--color-button-primary-text-dark)] dark:hover:bg-[var(--color-button-primary-hover-dark)]'
                      } flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-md transition-colors font-medium text-xs sm:text-sm`}
                  >
                    {loading || updateUserMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <LoaderCircle className="animate-spin w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Updating...
                      </span>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading || uploadingImage || updateUserMutation.isPending || !formChanged}
                    className={`${loading || uploadingImage || !formChanged || updateUserMutation.isPending
                      ? 'bg-[var(--color-button-secondary-light)] text-[var(--color-button-disabled-text-light)] border-[var(--color-button-disabled-light)] dark:text-[var(--color-button-disabled-text-dark)] dark:border-[var(--color-button-disabled-dark)] cursor-not-allowed'
                      : 'bg-[var(--color-button-secondary-light)] text-[var(--color-button-secondary-text-light)] border-[var(--color-button-secondary-border-light)] hover:bg-[var(--color-button-secondary-hover-light)] dark:text-[var(--color-button-secondary-text-dark)] dark:border-[var(--color-button-secondary-border-dark)] dark:hover:bg-[var(--color-button-secondary-hover-dark)]'
                      } border flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-md transition-colors font-medium text-xs sm:text-sm`}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;