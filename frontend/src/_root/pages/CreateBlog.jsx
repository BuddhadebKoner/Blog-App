import React from 'react';
import CreateBlogForm from '../../components/CreateBlogForm';
import { useAuth } from '../../context/AuthContext';
import { LoaderCircle, ShieldQuestion } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const CreateBlog = () => {
  // Extract user from context 
  const {
    isAuthenticated,
    isAuthenticatedLoading,
    isAuthenticatedError,
    currentUser,
  } = useAuth();

  if (isAuthenticatedError) {
    return (
      <div className="p-4 text-sm sm:text-base">
        Error: {isAuthenticatedError.message}
      </div>
    );
  }

  if (isAuthenticatedLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] md:min-h-screen w-full rounded-lg shadow-lg p-3 sm:p-4 md:p-6 dark:border-[var(--color-border-dark)]">
        <LoaderCircle className="animate-spin w-8 h-8 sm:w-10 sm:h-10" />
      </div>
    );
  }

  if (!isAuthenticated || currentUser === null) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center min-h-[50vh] md:min-h-screen w-full rounded-lg shadow-lg p-3 sm:p-4 md:p-6 dark:border-[var(--color-border-dark)]">
        <ShieldQuestion className="w-8 h-8 sm:w-10 sm:h-10" />
        <p className="text-sm sm:text-base text-center sm:text-left">
          Please{" "}
          <Link to={'/sign-in'} className="text-blue-500 hover:underline">
            Sign In
          </Link>{" "}
          or{" "}
          <Link to={'/sign-up'} className="text-blue-500 hover:underline">
            Sign Up
          </Link>{" "}
          to view this page.
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Create Blog - Blog</title>
      </Helmet>

      <CreateBlogForm currentUser={currentUser} />
    </>
  );
};

export default CreateBlog;