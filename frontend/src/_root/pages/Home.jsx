import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, BookOpen, Users, ArrowRight, LoaderCircle } from 'lucide-react';
import BlogCard from '../../components/BlogCard';
import { Helmet } from 'react-helmet';
import { useGetRecentBlogs } from '../../lib/react-query/queriesAndMutation';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();

  const { serverStatus } = useAuth();

  const {
    data: recentBlogs = [],
    isLoading,
  } = useGetRecentBlogs();

  // Make sure we're dealing with an array by checking the shape of the data
  const blogs = Array.isArray(recentBlogs) ? recentBlogs : (recentBlogs?.recentBlogs || []);  

  return (
    <>
      <Helmet>
        <title>Home - Blog</title>
      </Helmet>

      {
        !serverStatus.isRunning ? (
          null
        ) : (
          <div className="w-full overflow-auto">
            {/* Hero Section */}
            <section className="w-full px-3 sm:px-4 py-10 sm:py-16 md:py-24 flex flex-col items-center text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight max-w-4xl">
                Discover Insightful Stories and Ideas
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-6 sm:mb-8 px-2">
                Your destination for thoughtful articles on technology, creativity, and everything in between. Join our community of curious minds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md">
                <button
                  onClick={() => navigate('/blogs')}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[var(--color-button-primary-light)] dark:bg-[var(--color-button-primary-dark)] text-[var(--color-button-primary-text-light)] dark:text-[var(--color-button-primary-text-dark)] rounded-lg font-medium hover:bg-[var(--color-button-primary-hover-light)] dark:hover:bg-[var(--color-button-primary-hover-dark)] transition-colors text-sm sm:text-base"
                >
                  Explore All Blogs
                </button>
                <Link
                  to={""}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[var(--color-button-secondary-light)] dark:bg-[var(--color-button-secondary-dark)] text-[var(--color-button-secondary-text-light)] dark:text-[var(--color-button-secondary-text-dark)] border border-[var(--color-button-secondary-border-light)] dark:border-[var(--color-button-secondary-border-dark)] rounded-lg font-medium hover:bg-[var(--color-button-secondary-hover-light)] dark:hover:bg-[var(--color-button-secondary-hover-dark)] transition-colors text-sm sm:text-base"
                >
                  Know More
                </Link>
              </div>
            </section>

            {/* Video Showcase Section */}
            <section className="w-full px-3 sm:px-4 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg py-6 sm:py-8">
              <div className="max-w-5xl mx-auto">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src="https://res.cloudinary.com/dsfztnp9x/video/upload/v1741018410/Screencast_from_2025-03-03_21-27-01_jwbguj.webm" type="video/webm" />
                    <source src="https://res.cloudinary.com/dsfztnp9x/video/upload/v1741018410/Screencast_from_2025-03-03_21-27-01_jwbguj.webm" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="mt-4 sm:mt-6 flex justify-center">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Learn More
                    </span>
                    <span>•</span>
                    <span>3:45 minutes</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Posts Section */}
            <section className="w-full px-3 sm:px-4 py-8 sm:py-12 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
              <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Featured Posts
                  </h2>
                  <button
                    onClick={() => navigate('/blogs')}
                    className="flex items-center text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] font-medium hover:underline text-sm sm:text-base"
                  >
                    View all <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {
                  isLoading ? (
                    <div className="flex justify-center items-center py-6 sm:py-8">
                      <LoaderCircle className='animate-spin w-8 h-8 sm:w-10 sm:h-10' />
                    </div>
                  ) : blogs.length === 0 ? (
                    <p className="text-center py-6 sm:py-8 text-gray-600 dark:text-gray-400 text-sm sm:text-base">No blogs available at the moment.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {blogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} autherUrl={blog?.author?.imageUrl} />
                      ))}
                    </div>
                  )
                }
              </div>
            </section>

            {/* Why Join Us Section */}
            <section className="w-full px-3 sm:px-4 py-10 sm:py-16 md:py-24">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8 sm:mb-12">
                  Why Join Our Community
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] hover:shadow-md transition-shadow">
                    <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">Trending Topics</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Stay informed with the latest trends and insights from industry experts.</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] hover:shadow-md transition-shadow">
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">Quality Content</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Thoughtfully curated articles providing valuable insights and knowledge.</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1 mx-auto sm:mx-0 sm:max-w-xs md:max-w-none">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">Vibrant Community</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Connect with like-minded individuals and share your own perspectives.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="w-full px-3 sm:px-4 py-10 sm:py-16 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Stay Updated
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-2">
                  Subscribe to our newsletter to receive the latest updates and articles directly in your inbox.
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto px-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-button-primary-light)] dark:focus:ring-[var(--color-button-primary-dark)] text-sm sm:text-base"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--color-button-primary-light)] dark:bg-[var(--color-button-primary-dark)] text-[var(--color-button-primary-text-light)] dark:text-[var(--color-button-primary-text-dark)] rounded-lg font-medium hover:bg-[var(--color-button-primary-hover-light)] dark:hover:bg-[var(--color-button-primary-hover-dark)] transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </section>
          </div>
        )
      }
    </>
  );
};

export default Home;