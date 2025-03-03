import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import Signin from './_auth/pages/Signin';
import Signup from './_auth/pages/Signup';
import ForgotPassword from './_auth/pages/ForgotPassword.jsx';
import { About, BlogDetails, Blogs, CreateBlog, Home, Profile, Settings, UpdateBlog } from './_root/pages/index.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OfflineDetector from './components/OfflineDetector.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { ShieldAlert } from 'lucide-react';

const App = () => {
   const { serverStatus } = useAuth();

   return (
      <>
         {
            !serverStatus.isRunning ? (
               <main className='w-full h-screen mx-auto
       bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
       text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]
       overflow-hidden'>
                  <div className="flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 gap-5">
                     <ShieldAlert
                        className='w-10 h-10 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]'
                     />
                     <div className='space-y-2'>
                        <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                           {serverStatus.message}
                        </p>
                        <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                           Probably the server is not running or the database connection is not established.
                        </p>
                     </div>
                  </div>
               </main>
            ) : (
               <OfflineDetector >
                  <main className='w-full h-screen mx-auto
       bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
       text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]
       overflow-hidden'>
                     <Routes>
                        <Route element={<AuthLayout />}>
                           <Route path='/sign-in' element={<Signin />} />
                           <Route path='/sign-up' element={<Signup />} />
                           <Route path='/forgot-password' element={<ForgotPassword />} />
                        </Route>
                        <Route element={<RootLayout />}>
                           <Route path='/' element={<Home />} />
                           <Route path='/about' element={<About />} />
                           <Route path='/blogs' element={<Blogs />} />
                           <Route path='/blog/:slugParam' element={<BlogDetails />} />
                           <Route path='/create-blog' element={<CreateBlog />} />
                           <Route path='/settings' element={<Settings />} />
                           <Route path='/update-blog/:slugParam' element={<UpdateBlog />} />
                           <Route path='/profile/:id' element={<Profile />} />
                        </Route>
                     </Routes>
                     {/* Toast notifications */}
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
               </OfflineDetector>
            )
         }

      </>
   );
};

export default App;