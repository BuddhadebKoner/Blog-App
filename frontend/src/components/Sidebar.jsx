import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Info, LogOutIcon, Moon, Plus, Rss, Sun, UserRoundPlus } from 'lucide-react';
import { useLogOut } from '../lib/react-query/queriesAndMutation';

const Sidebar = ({ isAuthenticated, currentUser }) => {
   const {
      mutate: LogOut,
   } = useLogOut();

   const [theme, setTheme] = useState(() => {
      if (localStorage.theme) {
         return localStorage.theme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
   });

   useEffect(() => {
      if (theme === 'dark') {
         document.documentElement.classList.add('dark');
         localStorage.theme = 'dark';
      } else {
         document.documentElement.classList.remove('dark');
         localStorage.theme = 'light';
      }
   }, [theme]);

   const toggleTheme = () => {
      setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
   };

   return (
      <aside className='w-full md:w-64 max-h-[95vh] overflow-hidden
                      bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] 
                      md:h-[calc(100vh-3rem)] rounded-xl md:rounded-r-none 
                      shadow-lg transition-colors duration-300 flex flex-col justify-between border-r border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'>
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
                        dark:hover:bg-[var(--color-background-dark)] gap-3'
                  >
                     <Home />
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
                        dark:hover:bg-[var(--color-background-dark)] gap-3'
                  >
                     <Info />
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
                        dark:hover:bg-[var(--color-background-dark)] gap-3'
                  >
                     <Rss />
                     Blogs
                  </Link>
               </li>
               {
                  isAuthenticated ? (
                     <>
                        <li>
                           <Link
                              to='/create-blog'
                              className='flex items-center px-4 py-3 rounded-lg 
                        transition-colors duration-200 
                        text-[var(--color-text-primary-light)] 
                        hover:bg-[var(--color-background-light)] 
                        dark:text-[var(--color-text-primary-dark)] 
                        dark:hover:bg-[var(--color-background-dark)] gap-3'
                           >
                              <Plus />
                              Create Blog
                           </Link>
                        </li>
                     </>
                  ) : (
                     null
                  )
               }

            </ul>
         </nav>

         {/* theme chnager */}
         <button
            onClick={toggleTheme}
            className="cursor-pointer flex gap-3 px-4 py-3 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]"
         >
            {theme === 'dark' ? <Moon /> : <Sun />}
            {theme === 'dark' ? 'Dark' : 'Light'}
         </button>

         <div className='p-4 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'>
            {isAuthenticated ? (
               <div
                  className='flex items-center justify-between  
                       text-[var(--color-text-primary-light)]
                       dark:text-[var(--color-text-primary-dark)] '
               >
                  <Link
                     className='w-fit h-full px-4 py-3 transition-colors duration-200 rounded-lg  dark:hover:bg-[var(--color-background-dark)] hover:bg-[var(--color-background-light)]'
                     to={`/profile/${currentUser?._id}`}

                  >
                     {currentUser?.name}
                  </Link>
                  <button
                     className='cursor-pointer'
                     onClick={LogOut}
                  >
                     <LogOutIcon />
                  </button>
               </div>
            ) : (
               <Link
                  to='/sign-in'
                  className='flex items-center px-4 py-3 rounded-lg 
                    transition-colors duration-200 
                    text-[var(--color-text-primary-light)] 
                    hover:bg-[var(--color-background-light)] 
                    dark:text-[var(--color-text-primary-dark)] 
                    dark:hover:bg-[var(--color-background-dark)] gap-3'
               >
                  <UserRoundPlus />
                  Sign In
               </Link>
            )}
         </div>
      </aside >
   )
}

export default Sidebar;
