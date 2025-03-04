import React from 'react';
import { useGetAllBlogs } from '../../lib/react-query/queriesAndMutation';
import { LoaderCircle, ShieldAlert } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import BlogCard from '../../components/BlogCard';
import { Helmet } from 'react-helmet';

const Blogs = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetAllBlogs();

  // Setup infinite scrolling with intersection observer
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten the pages data for rendering
  const blogs = data?.pages?.flatMap(page => page.blogs) || [];
  const totalBlogs = data?.pages?.[0]?.totalBlogs || 0;

  return (
    <>
      <Helmet>
        <title>Blogs - Blog</title>
      </Helmet>

      <div className="w-full max-w-5xl h-fit overflow-auto mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <div className="w-full mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Latest Blog Posts</h1>
          {totalBlogs > 0 && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Showing {blogs.length} of {totalBlogs} posts
            </p>
          )}
        </div>

        {isLoading && !blogs.length ? (
          <div className="flex justify-center py-8 sm:py-12 md:py-16">
            <LoaderCircle className="animate-spin w-8 sm:w-10 h-8 sm:h-10 text-gray-500" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-center px-3">
            <ShieldAlert className="w-10 sm:w-12 h-10 sm:h-12 text-red-500 mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">Failed to load blogs</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{error?.message || "Please try again later"}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-center">
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">No blog posts available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} autherUrl={blog.author.imageUrl} />
            ))}
          </div>
        )}

        {/* Infinite scroll loading indicator */}
        <div ref={ref} className="flex justify-center py-4 sm:py-6 md:py-8 mt-2 sm:mt-4">
          {isFetchingNextPage && (
            <LoaderCircle className="animate-spin w-5 sm:w-6 h-5 sm:h-6 text-gray-500" />
          )}
        </div>
      </div>
    </>
  );
};

export default Blogs;