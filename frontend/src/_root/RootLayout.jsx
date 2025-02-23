import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext';

const RootLayout = () => {
  const {
    isAuthenticated,
    isAuthenticatedLoading,
    isAuthenticatedError,
    currentUser,
  } = useAuth();
  return (
    <section className='w-full h-full mx-auto bg-white dark:bg-gray-900 dark:text-gray-200 rounded-lg shadow-lg p-[2.5vh]'>
      <div className='flex rounded-3xl'>
        <Sidebar
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
        />
        <main className='flex-1 p-8 bg-gray-900'>
          <Outlet />
        </main>
      </div>
    </section>
  )
}

export default RootLayout