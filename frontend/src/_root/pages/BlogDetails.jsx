import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetBlogById } from '../../lib/react-query/queriesAndMutation';
import { useAuth } from '../../context/AuthContext';
import BlogSidebarCard from '../../components/BlogSidebarCard';
import { CircleUser, Trash } from 'lucide-react';

const BlogDetails = () => {
  const { slugParam } = useParams();
  const { data, isLoading, isError, error } = useGetBlogById(slugParam);
  const { currentUser } = useAuth();

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

  return (
    <div className="w-full h-fit overflow-auto bg-transparent  text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] lg:py-5 py-20 px-6 md:px-20 transition-colors duration-300">
      <section className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-base py-5">
            <Link
              to="/blogs"
              className="underline text-[var(--color-accent-light)] dark:text-[var(--color-accent-dark)]"
            >
              BLOGS
            </Link> /
            {blog.title.length > 25 ? `${blog.title.slice(0, 20)}...` : blog.title}
          </p>
          {currentUser?._id === blog.author._id && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              onClick={() => { /* Add delete functionality */ }}
            >
              <Trash className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover brightness-90 dark:brightness-75"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            {/* Keeping overlay text white for readability */}
            <h1 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
              {blog.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto mt-10 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-3/4">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to={`/profile/${blog.author._id}`}
            >
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
              <p className="text-lg font-semibold flex justify-start items-center gap-2">
                {blog.author.name}
              </p>
              <div className="flex items-center gap-4">
                <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-sm">
                  {publishedDate}
                </p>
                <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] text-sm">
                  {blog.readTime}
                </p>
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {blog.content.map((item) => (
              <div key={item._id} className="mb-6">
                {item.type === 'text' && (
                  <p className="text-lg leading-relaxed text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                    {item.value}
                  </p>
                )}
                {item.type === 'heading' && (
                  <h2 className="text-2xl font-bold mt-8 mb-4 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                    {item.value}
                  </h2>
                )}
                {item.type === 'bold' && (
                  <p className="text-lg font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                    {item.value}
                  </p>
                )}
                {item.type === 'highlight' && (
                  <span className="text-lg bg-[var(--color-accent-dark)] dark:bg-[var(--color-accent-light)] text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] px-2 py-1 inline-block rounded">
                    {item.value}
                  </span>
                )}
                {item.type === 'code' && (
                  <pre className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] p-4 rounded-md overflow-x-auto text-sm">
                    <code className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                      {item.value}
                    </code>
                  </pre>
                )}
              </div>
            ))}
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
  );
};

export default BlogDetails;
