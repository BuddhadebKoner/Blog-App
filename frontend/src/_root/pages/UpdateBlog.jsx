import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetBlogById, useUpdateBlog } from '../../lib/react-query/queriesAndMutation';
import { useAuth } from '../../context/AuthContext';
import UpdateBlogForm from '../../components/UpdateBlogForm';
import { LoaderCircle } from 'lucide-react';
import { Helmet } from "react-helmet";

const UpdateBlog = () => {
  const { slugParam } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const { data, isLoading, isError, error } = useGetBlogById(slugParam);
  const { mutate: updateBlog, isLoading: isUpdating } = useUpdateBlog();

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
    }
  }, [currentUser, navigate]);

  // Redirect if user is not the author
  useEffect(() => {
    if (data?.blog && currentUser && data.blog.author._id !== currentUser._id) {
      navigate('/blogs');
    }
  }, [data, currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error?.message}
      </div>
    );
  }

  if (!data?.blog) {
    return (
      <div className="text-center py-8">
        Blog not found
      </div>
    );
  }

  const handleUpdateBlog = async (formData) => {
    updateBlog(
      { slugParam, blogData: formData },
      {
        onSuccess: (response) => {
          if (response.success) {
            // Navigate to the updated blog
            const newSlugParam = response.blog.slugParam || slugParam;
            navigate(`/blog/${newSlugParam}`);
          } else {
            toast.error(response.message || 'Failed to update blog');
          }
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to update blog');
        }
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>Update Blog | Blog App</title>
      </Helmet>
      <div className="w-full h-full overflow-auto bg-transparent text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] lg:pb-10 md:py-10 px-1 sm:px-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Update Blog</h1>
          <UpdateBlogForm 
            currentUser={currentUser}
            initialData={data.blog}
            onSubmit={handleUpdateBlog}
            isLoading={isUpdating}
          />
        </div>
      </div>
    </>
  );
};

export default UpdateBlog;