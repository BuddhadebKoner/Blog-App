import React, { useState } from 'react';
import CreateBlogForm from '../../components/CreateBlogForm';
import PreviewBlogForm from '../../components/PreviewBlogForm';
import { useAuth } from '../../context/AuthContext';
import { LoaderCircle, ShieldQuestion } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [readTime, setReadTime] = useState('');
  const [slugParam, setSlugParam] = useState('');
  const [content, setContent] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract user from context 
  const {
    isAuthenticated,
    isAuthenticatedLoading,
    isAuthenticatedError,
    currentUser,
  } = useAuth();

  if (isAuthenticatedError) return (
    <div className="p-4 text-sm sm:text-base">
      Error: {isAuthenticatedError.message}
    </div>
  );

  if (loading || isAuthenticatedLoading) {
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

      <div className="flex-1 w-full h-[100dvh] flex overflow-hidden">
        <div className="flex flex-1 flex-col lg:flex-row w-full overflow-auto lg:overflow-hidden">
          <CreateBlogForm
            title={title}
            setTitle={setTitle}
            videoLink={videoLink}
            setVideoLink={setVideoLink}
            readTime={readTime}
            setReadTime={setReadTime}
            slugParam={slugParam}
            setSlugParam={setSlugParam}
            content={content}
            setContent={setContent}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            currentUser={currentUser}
            setLoading={setLoading}
            loading={loading}
          />
          <PreviewBlogForm
            title={title}
            videoLink={videoLink}
            readTime={readTime}
            slugParam={slugParam}
            content={content}
            currentUser={currentUser}
            imageUrl={imageUrl}
          />
        </div>
      </div>
    </>
  );
};

export default CreateBlog;