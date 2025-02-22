import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import Signin from './_auth/pages/Signin'
import Signup from './_auth/pages/Signup'
import { About, BlogDetails, Blogs, CreateBlog, Home, Profile, UpdateBlog } from './_root/pages/index.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

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
      <main className='w-full h-screen mx-auto bg-amber-200 dark:bg-gray-800 bg:text-gray-800 dark:text-gray-200'>

         <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-xl"
         >
            {theme === 'dark' ? '🌞' : '🌙'}
         </button>

         <Routes>
            <Route element={<AuthLayout />}>
               <Route path='/sign-in' element={<Signin />} />
               <Route path='/sign-up' element={<Signup />} />
            </Route>
            <Route element={<RootLayout />}>
               <Route path='/' element={<Home />} />
               <Route path='/about' element={<About />} />
               <Route path='/blogs' element={<Blogs />} />
               <Route path='/blog/:slugParam' element={<BlogDetails />} />
               <Route path='/create-blog' element={<CreateBlog />} />
               <Route path='/update-blog/:slugParam' element={<UpdateBlog />} />
               <Route path='/profile/:id' element={<Profile />} />
            </Route>
         </Routes>

         {/* toast notification */}
         <ToastContainer
            position="bottom-right"
            autoClose={10000}
            limit={3}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
         />
      </main>
   )
}

export default App