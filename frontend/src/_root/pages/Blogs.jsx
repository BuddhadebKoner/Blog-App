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

  // console.log(blogs);

  return (
    <>
      <Helmet>
        <title>Blogs - Blog</title>
      </Helmet>

      <div className="w-full max-w-5xl h-fit overflow-auto mx-auto p-4 md:p-6">
        <div className="w-full mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest Blog Posts</h1>
          {totalBlogs > 0 && (
            <p className="text-gray-600 dark:text-gray-400">Showing {blogs.length} of {totalBlogs} posts</p>
          )}
        </div>

        {isLoading && !blogs.length ? (
          <div className="flex justify-center py-16">
            <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Failed to load blogs</h2>
            <p className="text-gray-600 dark:text-gray-400">{error?.message || "Please try again later"}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">No blog posts available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} autherUrl={blog.author.imageUrl} />
            ))}
          </div>
        )}

        {/* Infinite scroll loading indicator */}
        <div ref={ref} className="flex justify-center py-8 mt-4">
          {isFetchingNextPage && (
            <LoaderCircle className="animate-spin w-6 h-6 text-gray-500" />
          )}
        </div>
      </div>
    </>
  );
};

export default Blogs;