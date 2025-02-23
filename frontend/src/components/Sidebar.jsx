import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = (
   { isAuthenticated, currentUser }
) => {

   return (
      <aside className='w-64 h-[95vh] bg-gray-800 border-r border-gray-700 flex flex-col'>
         <div className='p-4 border-b border-gray-700'>
            <h1 className='text-2xl font-bold text-white'>Explore</h1>
         </div>

         <nav className='flex-1 overflow-y-auto'>
            <ul className='space-y-2 p-4'>
               {[
                  { path: '/', name: 'Home' },
                  { path: '/about', name: 'About' },
                  { path: '/blogs', name: 'Blogs' },
                  { path: '/create-blog', name: 'Create Blog' },
               ].map((item) => (
                  <li key={item.path}>
                     <Link
                        to={item.path}
                        className='flex items-center px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-white text-gray-300'
                     >
                        {item.name}
                     </Link>
                  </li>
               ))}
            </ul>
         </nav>

         <div className='p-4 border-t border-gray-700'>
            {
               isAuthenticated ? (
                  <Link
                     to={`/profile/${currentUser?._id}`}
                     className='flex items-center px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-white text-gray-300'
                  >
                     {currentUser?.name}
                  </Link>
               ) : (
                  <Link
                     to='/sign-in'
                     className='flex items-center px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-white text-gray-300'
                  >
                     Sign In
                  </Link>
               )
            }

         </div>
      </aside>
   )
}

export default Sidebar