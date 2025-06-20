import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDeleteBlog, useGetBlogById } from '../../lib/react-query/queriesAndMutation';
import { useAuth } from '../../context/AuthContext';
import BlogSidebarCard from '../../components/BlogSidebarCard';
import { CircleUser, LoaderCircle, Trash, Edit3 } from 'lucide-react';
import { Helmet } from "react-helmet";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const BlogDetails = () => {
  const { slugParam } = useParams();
  const { data, isLoading, isError, error } = useGetBlogById(slugParam);
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const {
    mutate: deleteBlog,
    isLoading: isDeleting,
  } = useDeleteBlog();

  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isLoading) return <div className="text-center py-8">Loading blog...</div>;
  if (isError) return <div className="text-red-500 text-center py-8">Error: {error?.message}</div>;
  if (!data?.blog) return <div className="text-center py-8">Blog not found</div>;

  const blog = data.blog;
  const publishedDate = new Date(blog.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (isDeleting) {
    return (
      <div className="flex justify-center items-center min-h-screen rounded-lg shadow-lg p-4 space-y-4">
        <LoaderCircle className="animate-spin w-10 h-10" />
      </div>
    );
  }

  const handleDeleteBlog = () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(slugParam, {
        onSuccess: () => {
          navigate(-1);
          // You can add toast notification here if you have toast setup
          console.log('Blog deleted successfully');
        }
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | Blog</title>
      </Helmet>
      <div className="w-full h-fit overflow-auto bg-transparent text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] lg:pb-10 md:py-10 px-1 sm:px-6 transition-colors duration-300">
        <section className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center sm:items-center mb-3">
            <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-xs sm:text-base py-5">
              <Link
                to="/blogs" 
                className="underline text-[var(--color-accent-light)] dark:text-[var(--color-accent-dark)]"
              >
                BLOGS
              </Link> /
              {blog.title.length > 25 ? `${blog.title.slice(0, 20)}...` : blog.title}
            </p>
            {currentUser?._id === blog.author._id && (
              <div className="flex gap-2">
                <button
                  className="mt-2 sm:mt-0 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                  onClick={() => navigate(`/update-blog/${slugParam}`)}
                >
                  <Edit3 />
                </button>
                <button
                  className="mt-2 sm:mt-0 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                  onClick={handleDeleteBlog}
                >
                  <Trash />
                </button>
              </div>
            )}
          </div>

          <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover brightness-90 dark:brightness-75"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold text-center px-4">
                {blog.title}
              </h1>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto lg:mt-10 mt-5 flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="w-full md:w-3/4">
            <div className="flex items-center gap-4 mb-6">
              <Link to={`/profile/${blog.author._id}`}>
                {blog.author.imageUrl ? (
                  <img
                    src={blog.author.imageUrl}
                    alt={blog.author.name}
                    className="w-12 h-12 rounded-full border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]"
                  />
                ) : (
                  <CircleUser className="w-10 h-10" />
                )}
              </Link>
              <div>
                <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
                  {blog.author.name}
                </p>
                <div className="flex items-center gap-4">
                  <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-xs sm:text-sm">
                    {publishedDate}
                  </p>
                  <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-xs sm:text-sm">
                    {blog.readTime} min read
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none px-1">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom styling for different markdown elements
                  p: ({ children }) => (
                    <p className="text-base sm:text-lg leading-relaxed text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-4xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-6 mt-8">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl sm:text-3xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-5 mt-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg sm:text-2xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4 mt-5">
                      {children}
                    </h3>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                      {children}
                    </strong>
                  ),
                  code: ({ inline, children }) => {
                    if (inline) {
                      return (
                        <code className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] px-2 py-1 rounded text-sm font-mono text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="font-mono text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] p-4 rounded-lg overflow-x-auto text-xs sm:text-sm border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shadow-sm mb-4">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[var(--color-accent-light)] dark:border-[var(--color-accent-dark)] pl-4 italic text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mb-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:underline"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-2">{children}</li>
                  ),
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>

            {blog.videoLink && getYouTubeID(blog.videoLink) && (
              <div className="mt-10">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeID(blog.videoLink)}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/4">
            <BlogSidebarCard author={blog.author} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
