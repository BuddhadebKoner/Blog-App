import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserById } from '../../lib/react-query/queriesAndMutation';
import { LoaderCircle, ShieldAlert } from 'lucide-react';

const Profile = () => {
  // extract params for url
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error
  } = useGetUserById(id)

  if (isLoading) return (
    <div className='flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 dark:border-[var(--color-border-dark)]'>
      <LoaderCircle className='animate-spin w-10 h-10' />
    </div>
  )

  if (isError) return (
    <div className="flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 gap-5">
      <ShieldAlert
        className='w-10 h-10'
      />
      <p className="text-gray-700 dark:text-gray-300">{error.message}</p>
    </div>
  )

  if (!data || !data.user) return (
    <div className="flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 gap-5">
      <ShieldAlert
        className='w-10 h-10'
      />
      <p className="text-gray-700 dark:text-gray-300">User data not found</p>
    </div>
  )

  const user = data.user;
  // console.log(user);

  return (
    <div className="profile-container flex flex-col items-center p-6 max-w-3xl mx-auto">
      <div className="profile-header w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="profile-image-container">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={`${user.name}'s profile`}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-200">
                  {user.name?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="user-info text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{user.email}</p>
            <div className="verification-badge flex items-center justify-center md:justify-start gap-2">
              {user.isVarified ? (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Not Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-details w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-900 dark:text-white">Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="detail-item">
            <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{user._id}</p>
          </div>
          <div className="detail-item">
            <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile