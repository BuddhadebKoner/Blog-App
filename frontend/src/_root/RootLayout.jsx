import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext';
import { LoaderCircle } from 'lucide-react';

const RootLayout = () => {
  const { isAuthenticated, currentUser, isAuthenticatedLoading } = useAuth();

  return (
    <section className='w-full min-h-screen
                        bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] 
                        transition-colors duration-300'>
      {
        isAuthenticatedLoading ? (
          <div className='flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg 
                      p-4 space-y-4 md:space-y-0 md:p-6
                       dark:border-[var(--color-border-dark)]'>

            <LoaderCircle className='animate-spin w-10 h-10' />
          </div>
        ) : (
          <>
            <div className='flex flex-col md:flex-row md:min-h-screen md:rounded-lg shadow-lg 
                      sm:p-[2.5vh] md:space-y-0 md:p-6
                       dark:border-[var(--color-border-dark)]'>

              <Sidebar
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
              />
              <main className='flex-1 max-h-[95vh] overflow-hidden
                        bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] 
                        rounded-xl md:rounded-l-none md:rounded-r-xl 
                        p-4 md:p-8 transition-colors duration-300 shadow-lg'>
                <Outlet />
              </main>
            </div>
          </>
        )
      }

    </section >
  )
}

export default RootLayout;
