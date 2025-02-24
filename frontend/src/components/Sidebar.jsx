import React from 'react'
import { Link } from 'react-router-dom'
import { LogOutIcon } from 'lucide-react';
import { useLogOut } from '../lib/react-query/queriesAndMutation';

const Sidebar = ({ isAuthenticated, currentUser, isAuthenticatedLoading }) => {

   const {
      mutate: LogOut,
   } = useLogOut();

   return (
      <aside className='w-full md:w-64 
                      bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] 
                      md:h-[calc(100vh-3rem)] rounded-xl md:rounded-r-none 
                      shadow-lg transition-colors duration-300'>
         <div className='p-4 border-b 
                      border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'>
            <h1 className='text-2xl font-bold 
                       text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]'>
               Explore
            </h1>
         </div>

         <nav className='flex-1 overflow-y-auto'>
            <ul className='space-y-2 p-4'>
               <li>
                  <Link
                     to='/'
                     className='flex items-center px-4 py-3 rounded-lg 
                        transition-colors duration-200 
                        text-[var(--color-text-primary-light)] 
                        hover:bg-[var(--color-background-light)] 
                        dark:text-[var(--color-text-primary-dark)] 
                        dark:hover:bg-[var(--color-background-dark)]'
                  >
                     Home
                  </Link>
               </li>
               <li>
                  <Link
                     to='/about'
                     className='flex items-center px-4 py-3 rounded-lg 
                        transition-colors duration-200 
                        text-[var(--color-text-primary-light)] 
                        hover:bg-[var(--color-background-light)] 
                        dark:text-[var(--color-text-primary-dark)] 
                        dark:hover:bg-[var(--color-background-dark)]'
                  >
                     About
                  </Link>
               </li>
               <li>
                  <Link
                     to='/blogs'
                     className='flex items-center px-4 py-3 rounded-lg 
                        transition-colors duration-200 
                        text-[var(--color-text-primary-light)] 
                        hover:bg-[var(--color-background-light)] 
                        dark:text-[var(--color-text-primary-dark)] 
                        dark:hover:bg-[var(--color-background-dark)]'
                  >
                     Blogs
                  </Link>
               </li>
               {
                  isAuthenticated ? (
                     <li>
                        <Link
                           to='/create-blog'
                           className='flex items-center px-4 py-3 rounded-lg 
                        transition-colors duration-200 
                        text-[var(--color-text-primary-light)] 
                        hover:bg-[var(--color-background-light)] 
                        dark:text-[var(--color-text-primary-dark)] 
                        dark:hover:bg-[var(--color-background-dark)]'
                        >
                           Create Blog
                        </Link>
                     </li>
                  ) : isAuthenticatedLoading ? (
                     <div className='flex items-center px-4 py-3 rounded-lg 
                           transition-colors duration-200 
                           text-[var(--color-text-primary-light)] 
                           hover:bg-[var(--color-background-light)] 
                           dark:text-[var(--color-text-primary-dark)] 
                           dark:hover:bg-[var(--color-background-dark)]'
                     >
                        Loading...
                     </div>
                  ) : (
                     null
                  )
               }

            </ul>
         </nav>

         <div className='p-4 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'>
            {isAuthenticated ? (
               <div
                  className='flex items-center justify-between px-4 py-3 rounded-lg 
                       transition-colors duration-200 
                       text-[var(--color-text-primary-light)] 
                       hover:bg-[var(--color-background-light)] 
                       dark:text-[var(--color-text-primary-dark)] 
                       dark:hover:bg-[var(--color-background-dark)]'
               >
                  <Link
                     to={`/profile/${currentUser?._id}`}

                  >
                     {currentUser?.name}
                  </Link>
                  <button
                     onClick={LogOut}
                  >
                     <LogOutIcon />
                  </button>
               </div>
            ) : isAuthenticatedLoading ? (
               <div className='flex items-center px-4 py-3 rounded-lg 
                           transition-colors duration-200 
                           text-[var(--color-text-primary-light)] 
                           hover:bg-[var(--color-background-light)] 
                           dark:text-[var(--color-text-primary-dark)] 
                           dark:hover:bg-[var(--color-background-dark)]'
               >
                  Loading...
               </div>
            ) : (
               <Link
                  to='/sign-in'
                  className='flex items-center px-4 py-3 rounded-lg 
                    transition-colors duration-200 
                    text-[var(--color-text-primary-light)] 
                    hover:bg-[var(--color-background-light)] 
                    dark:text-[var(--color-text-primary-dark)] 
                    dark:hover:bg-[var(--color-background-dark)]'
               >
                  Sign In
               </Link>
            )}
         </div>
      </aside >
   )
}

export default Sidebar;
