import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, LogOutIcon, Moon, Plus, Rss, Sun, UserRoundPlus, Monitor, Settings, X } from 'lucide-react';
import { useLogOut } from '../lib/react-query/queriesAndMutation';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isAuthenticated, currentUser, isSidebarOpen, toggleSidebar }) => {
   const { mutate: LogOut } = useLogOut();
   const { theme, toggleTheme, isDark } = useTheme();
   const location = useLocation();

   // Theme options dropdown state
   const [showThemeOptions, setShowThemeOptions] = useState(false);

   // Close sidebar when clicking a link on mobile
   const handleLinkClick = () => {
      if (window.innerWidth < 768) {
         toggleSidebar(false);
      }
   };

   // Get icon based on theme
   const getThemeIcon = () => {
      if (theme === 'system') return <Monitor />;
      return theme === 'dark' ? <Moon /> : <Sun />;
   };

   // Get text based on theme
   const getThemeText = () => {
      if (theme === 'system') return 'System';
      return theme === 'dark' ? 'Dark' : 'Light';
   };

   // Check if link is active
   const isActive = (path) => {
      return location.pathname === path;
   };

   // Render link with active state styling
   const renderNavLink = (to, icon, text) => {
      const active = isActive(to);
      return (
         <Link
            to={to}
            onClick={handleLinkClick}
            className={`flex items-center px-4 py-3 rounded-lg 
                     transition-all duration-300 ease-in-out
                     relative overflow-hidden
                     ${active
                  ? 'text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)] font-medium bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]'
                  : 'text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)]'
               } gap-3`}
         >
            <div className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
               {icon}
            </div>
            <span className={`transition-all duration-300 ${active ? 'translate-x-1' : ''}`}>
               {text}
            </span>
            {active && (
               <div className="absolute left-0 top-0 w-1 h-full bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)]" />
            )}
         </Link>
      );
   };

   return (
      <>
         {/* Mobile overlay */}
         {isSidebarOpen && (
            <div
               className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
               onClick={() => toggleSidebar(false)}
            />
         )}

         <aside className={`fixed md:static w-[280px] md:w-64 h-full md:h-[calc(100vh-3rem)] z-40
                      bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]
                      rounded-none md:rounded-r-none md:rounded-l-xl
                      shadow-lg transition-all duration-300 ease-in-out flex flex-col justify-between 
                      border-r border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]
                      ${isSidebarOpen ? 'left-0' : '-left-[280px] md:left-0'}`}>

            <div className='p-4 border-b flex justify-between items-center
                      border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'>
               <h1 className='text-2xl font-bold 
                       text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]'>
                  Explore
               </h1>
               <button
                  className="md:hidden text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]"
                  onClick={() => toggleSidebar(false)}
               >
                  <X size={24} />
               </button>
            </div>

            <nav className='flex-1 overflow-y-auto'>
               <ul className='space-y-2 p-4'>
                  <li>
                     {renderNavLink('/', <Home />, 'Home')}
                  </li>
                  <li>
                     {renderNavLink('/about', <Info />, 'About')}
                  </li>
                  <li>
                     {renderNavLink('/blogs', <Rss />, 'Blogs')}
                  </li>
                  {isAuthenticated && (
                     <>
                        <li>
                           {renderNavLink('/create-blog', <Plus />, 'Create Blog')}
                        </li>
                        <li>
                           {renderNavLink('/settings', <Settings />, 'Settings')}
                        </li>
                     </>
                  )}
               </ul>
            </nav>

            {/* Theme changer with dropdown */}
            <div className="relative border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
               <button
                  onClick={() => setShowThemeOptions(!showThemeOptions)}
                  className="w-full cursor-pointer flex justify-between items-center gap-3 px-4 py-3 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)] transition-colors duration-200"
               >
                  <div className="flex items-center gap-3">
                     <div className={`transition-transform duration-300 ${showThemeOptions ? 'rotate-12' : ''}`}>
                        {getThemeIcon()}
                     </div>
                     {getThemeText()}
                  </div>
                  <svg
                     className={`w-4 h-4 transition-transform duration-300 ${showThemeOptions ? 'rotate-180' : ''}`}
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
               </button>

               {showThemeOptions && (
                  <div className="absolute bottom-full left-0 w-full bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-t-lg shadow-lg overflow-hidden animate-slideDown">
                     <ul>
                        <li>
                           <button
                              onClick={() => {
                                 toggleTheme('light');
                                 setShowThemeOptions(false);
                              }}
                              className={`w-full flex items-center px-4 py-2 hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)] 
                                 ${theme === 'light' ? 'text-[var(--color-primary-light)] bg-[var(--color-background-light)]' : 'text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]'} transition-colors duration-200`}
                           >
                              <Sun className={`mr-2 transition-transform duration-300 ${theme === 'light' ? 'scale-110' : ''}`} size={18} />
                              Light
                           </button>
                        </li>
                        <li>
                           <button
                              onClick={() => {
                                 toggleTheme('dark');
                                 setShowThemeOptions(false);
                              }}
                              className={`w-full flex items-center px-4 py-2 hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)] 
                                 ${theme === 'dark' ? 'text-[var(--color-primary-dark)] bg-[var(--color-background-dark)]' : 'text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]'} transition-colors duration-200`}
                           >
                              <Moon className={`mr-2 transition-transform duration-300 ${theme === 'dark' ? 'scale-110' : ''}`} size={18} />
                              Dark
                           </button>
                        </li>
                        <li>
                           <button
                              onClick={() => {
                                 toggleTheme('system');
                                 setShowThemeOptions(false);
                              }}
                              className={`w-full flex items-center px-4 py-2 hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)] 
                                 ${theme === 'system' ? 'text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)] bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]' : 'text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]'} transition-colors duration-200`}
                           >
                              <Monitor className={`mr-2 transition-transform duration-300 ${theme === 'system' ? 'scale-110' : ''}`} size={18} />
                              System
                           </button>
                        </li>
                     </ul>
                  </div>
               )}
            </div>

            <div className='p-4 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'>
               {isAuthenticated ? (
                  <div
                     className='flex items-center justify-between  
                          text-[var(--color-text-primary-light)]
                          dark:text-[var(--color-text-primary-dark)]'
                  >
                     <Link
                        className={`w-fit h-full px-4 py-3 transition-all duration-300 rounded-lg dark:hover:bg-[var(--color-background-dark)] hover:bg-[var(--color-background-light)]
                           ${isActive(`/profile/${currentUser?._id}`) ? 'text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)] font-medium bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]' : ''}`}
                        to={`/profile/${currentUser?._id}`}
                        onClick={handleLinkClick}
                     >
                        <span className={`transition-transform duration-300 ${isActive(`/profile/${currentUser?._id}`) ? 'translate-x-1' : ''}`}>
                           {currentUser?.name}
                        </span>
                     </Link>
                     <button
                        className='cursor-pointer hover:text-[var(--color-primary-light)] dark:hover:text-[var(--color-primary-dark)] transition-colors duration-200 p-2 rounded-full hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)]'
                        onClick={() => {
                           LogOut();
                           if (window.innerWidth < 768) {
                              toggleSidebar(false);
                           }
                        }}
                     >
                        <LogOutIcon className="transition-transform duration-300 hover:scale-110" />
                     </button>
                  </div>
               ) : (
                  <div>
                     {renderNavLink('/sign-in', <UserRoundPlus />, 'Sign In')}
                  </div>
               )}
            </div>
         </aside>
      </>
   );
};


export default Sidebar;