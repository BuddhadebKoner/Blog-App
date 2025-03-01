import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetAllBlogsByUserId, useGetUserById } from '../../lib/react-query/queriesAndMutation';
import { LoaderCircle, ShieldAlert } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Profile = () => {
  // extract params for url
  const { id } = useParams();

  const {
    data: blogsData,
    isLoading: blogsLoading,
    isError: blogsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetAllBlogsByUserId(id);

  const {
    data,
    isLoading,
    isError,
    error
  } = useGetUserById(id);

  // Setup infinite scrolling with intersection observer
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return (
    <div className='flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 dark:border-[var(--color-border-dark)]'>
      <LoaderCircle className='animate-spin w-10 h-10' />
    </div>
  )

  if (isError) return (
    <div className="flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 gap-5">
      <ShieldAlert
        className='w-10 h-10 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]'
      />
      <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">{error.message}</p>
    </div>
  )

  if (!data || !data.user) return (
    <div className="flex justify-center items-center md:min-h-screen md:rounded-lg shadow-lg p-4 space-y-4 md:space-y-0 md:p-6 gap-5">
      <ShieldAlert
        className='w-10 h-10 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]'
      />
      <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">User data not found</p>
    </div>
  )

  const user = data.user;

  // Flatten the pages data for rendering
  const blogs = blogsData?.pages?.flatMap(page => page.blogs) || [];
  const totalBlogs = blogsData?.pages?.[0]?.totalBlogs || 0;

  return (
    <div className="w-full h-fit overflow-auto flex flex-col items-center p-6 max-w-3xl mx-auto">
      <div className='w-full'>
        <div className="profile-header w-full bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="profile-image-container">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.name}'s profile`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] flex items-center justify-center border-4 border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                  <span className="text-2xl font-bold text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                    {user.name?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="user-info text-center md:text-left">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">{user.name}</h1>
              <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mb-2">{user.email}</p>
              <div className="verification-badge flex items-center justify-center md:justify-start gap-2">
                {user.isVarified ? (
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Section */}
        <div className="blog-posts w-full bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] pb-2 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
            Blog Posts
            {totalBlogs > 0 && (
              <span className="ml-2 text-sm font-normal text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                ({totalBlogs})
              </span>
            )}
          </h2>

          {blogsLoading && !blogs.length ? (
            <div className="flex justify-center py-10">
              <LoaderCircle className="animate-spin w-8 h-8 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]" />
            </div>
          ) : blogsError ? (
            <div className="flex justify-center py-8 text-center">
              <div>
                <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">Failed to load blogs</p>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">No blog posts yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {blogs.map((blog) => (
                <div key={blog._id} className="blog-card border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <Link
                    to={`/blog/${blog.slugParam}`} className="flex flex-col md:flex-row">
                    {blog.imageUrl && (
                      <div className="blog-image md:w-1/3">
                        <img src={blog.imageUrl} alt={blog.title} className="h-48 md:h-full w-full object-cover" />
                      </div>
                    )}
                    <div className={`blog-content p-4 ${blog.imageUrl ? 'md:w-2/3' : 'w-full'} bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]`}>
                      <h3 className="text-lg font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-2">{blog.title}</h3>
                      <div className="flex items-center text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] space-x-4 mt-2">
                        <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                        {blog.readTime && <span>• {blog.readTime} min read</span>}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {/* Infinite scroll loading indicator */}
              <div ref={ref} className="flex justify-center py-4">
                {isFetchingNextPage && (
                  <LoaderCircle className="animate-spin w-6 h-6 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile;