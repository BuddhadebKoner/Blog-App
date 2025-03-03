import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUpdateUser } from '../../lib/react-query/queriesAndMutation';
import { LoaderCircle, User, Mail, Calendar, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';

const Settings = () => {
  const { isAuthenticated, isAuthenticatedLoading, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [userData, setUserData] = useState(null);
  const [formChanged, setFormChanged] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  const updateUserMutation = useUpdateUser();

  // Initialize user data
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPreviewImage(currentUser.imageUrl || '');
      setUserData(currentUser);
      setFormChanged(false);
      setFileSelected(false);
    }
  }, [currentUser]);

  // Check if form has changed
  useEffect(() => {
    if (userData) {
      setFormChanged(name !== userData.name || fileSelected);
    }
  }, [name, fileSelected, userData]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

        // Preview image
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
      } catch (error) {
        console.error('File reading error:', error);
        toast.error("Couldn't process image file");
        setFileSelected(false);
      }
    } else {
      setFileSelected(false);
    }
  };

  // Reset the form
  const handleReset = useCallback(() => {
    setName(userData?.name || '');
    setPreviewImage(userData?.imageUrl || '');
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
      toast.error('Error formatting date');
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
      // Create FormData for multipart/form-data submission
      const formData = new FormData();

      // Only add if user exists
      if (!userData || !userData._id) {
        toast.error('User data is missing');
        throw new Error('User data is missing');
      }

      formData.append('userID', userData._id);
      formData.append('name', name.trim());

      // Add image if selected
      if (fileInputRef.current?.files[0]) {
        const file = fileInputRef.current.files[0];

        // Double-check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image file is too large (max 5MB)');
          throw new Error('Image file is too large (max 5MB)');
        }

        // Double-check file type
        if (!file.type.startsWith('image/')) {
          toast.error('Invalid file type. Please select an image');
          throw new Error('Invalid file type');
        }

        formData.append('userImage', file);
      }

      // Update user
      await updateUserMutation.mutateAsync(formData);
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
      <div className="bg-[var(--color-background-light)] text-[var(--color-text-primary-light)] dark:bg-[var(--color-background-dark)] dark:text-[var(--color-text-primary-dark)] text-center py-8">
        Please login to access settings
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile Settings - Blog</title>
      </Helmet>

      <div className="w-full h-fit overflow-auto bg-transparent text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] max-w-3xl mx-auto p-6">
        <h1 className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-2xl font-bold mb-6">
          Profile Settings
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column - Profile Image */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              <div className="bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] p-4 rounded-lg border">
                <div className="flex flex-col items-center space-y-3">
                  <div className="border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] h-32 w-32 rounded-full overflow-hidden border-2">
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
                  <h2 className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-xl font-semibold">
                    {userData?.name || 'User'}
                  </h2>
                  <div className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-sm">
                    Member since {formatDate(userData?.createdAt)}
                  </div>
                  <div className="flex items-center">
                    {userData?.isVarified ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle size={16} className="mr-1" />
                        <span>Verified Account</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <X size={16} className="mr-1" />
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
            <div className="bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] p-6 rounded-lg border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-xl font-semibold mb-4">
                  Edit Profile
                </h2>

                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <label className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] block text-sm font-medium">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-sm w-full p-2 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recommended: Square image, max 5MB
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] block text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-[var(--color-text-primary-light)] bg-[var(--color-background-light)] border-[var(--color-border-light)] dark:text-[var(--color-text-primary-dark)] dark:bg-[var(--color-background-dark)] dark:border-[var(--color-border-dark)] w-full px-3 py-2 border rounded-md"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>

                {/* Email (non-editable) */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] flex items-center text-sm font-medium"
                  >
                    <Mail size={16} className="mr-1" /> Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={userData?.email || ''}
                    className="text-[var(--color-text-secondary-light)] bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:text-[var(--color-text-secondary-dark)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] w-full px-3 py-2 border rounded-md cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* User ID (non-editable) */}
                <div className="space-y-2">
                  <label
                    htmlFor="userId"
                    className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] flex items-center text-sm font-medium"
                  >
                    <User size={16} className="mr-1" /> User ID
                  </label>
                  <input
                    id="userId"
                    type="text"
                    value={userData?._id || ''}
                    className="text-[var(--color-text-secondary-light)] bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:text-[var(--color-text-secondary-dark)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] w-full px-3 py-2 border rounded-md cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Last Updated (non-editable) */}
                <div className="space-y-2">
                  <label
                    htmlFor="lastUpdated"
                    className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] flex items-center text-sm font-medium"
                  >
                    <Calendar size={16} className="mr-1" /> Last Updated
                  </label>
                  <input
                    id="lastUpdated"
                    type="text"
                    value={formatDate(userData?.updatedAt)}
                    className="text-[var(--color-text-secondary-light)] bg-[var(--color-surface-light)] border-[var(--color-border-light)] dark:text-[var(--color-text-secondary-dark)] dark:bg-[var(--color-surface-dark)] dark:border-[var(--color-border-dark)] w-full px-3 py-2 border rounded-md cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading || updateUserMutation.isPending || !formChanged}
                    className={`${loading || !formChanged || updateUserMutation.isPending
                      ? 'bg-[var(--color-button-disabled-light)] text-[var(--color-button-disabled-text-light)] dark:bg-[var(--color-button-disabled-dark)] dark:text-[var(--color-button-disabled-text-dark)] cursor-not-allowed'
                      : 'bg-[var(--color-button-primary-light)] text-[var(--color-button-primary-text-light)] hover:bg-[var(--color-button-primary-hover-light)] dark:bg-[var(--color-button-primary-dark)] dark:text-[var(--color-button-primary-text-dark)] dark:hover:bg-[var(--color-button-primary-hover-dark)]'
                      } flex-1 py-2 px-4 rounded-md transition-colors font-medium`}
                  >
                    {loading || updateUserMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                        Updating...
                      </span>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading || updateUserMutation.isPending || !formChanged}
                    className={`${loading || !formChanged || updateUserMutation.isPending
                      ? 'bg-[var(--color-button-secondary-light)] text-[var(--color-button-disabled-text-light)] border-[var(--color-button-disabled-light)] dark:text-[var(--color-button-disabled-text-dark)] dark:border-[var(--color-button-disabled-dark)] cursor-not-allowed'
                      : 'bg-[var(--color-button-secondary-light)] text-[var(--color-button-secondary-text-light)] border-[var(--color-button-secondary-border-light)] hover:bg-[var(--color-button-secondary-hover-light)] dark:text-[var(--color-button-secondary-text-dark)] dark:border-[var(--color-button-secondary-border-dark)] dark:hover:bg-[var(--color-button-secondary-hover-dark)]'
                      } border flex-1 py-2 px-4 rounded-md transition-colors font-medium`}
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