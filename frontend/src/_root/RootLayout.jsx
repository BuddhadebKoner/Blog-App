import React, { useState } from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext';
import { LoaderCircle, Menu } from 'lucide-react';

const RootLayout = () => {
  const { isAuthenticated, currentUser, isAuthenticatedLoading, serverStatus } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (forcedState) => {
    if (forcedState !== undefined) {
      setIsSidebarOpen(forcedState);
    } else {
      setIsSidebarOpen(prev => !prev);
    }
  };

  if (!serverStatus.isRunning) {
    return;
  }

  return (
    <section className='w-full h-screen flex flex-col
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
            <div className='flex-1 min-h-0 flex flex-col md:flex-row md:min-h-screen md:rounded-lg shadow-lg 
                      sm:p-[2.5vh] md:space-y-0 md:p-6
                       dark:border-[var(--color-border-dark)]'>

              <Sidebar
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
              <main className='flex-1 flex flex-col min-h-0 overflow-hidden 
                        bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] 
                        rounded-none md:rounded-l-none md:rounded-r-xl
                         transition-colors duration-300 shadow-lg'>

                {/* Mobile hamburger menu button */}
                <div className="md:hidden p-4 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                  <button
                    onClick={() => toggleSidebar()}
                    className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] p-2"
                  >
                    <Menu size={24} />
                  </button>
                </div>

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
