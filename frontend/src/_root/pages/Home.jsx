import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, BookOpen, Users, ArrowRight } from 'lucide-react';
import BlogCard from '../../components/BlogCard';
import { Helmet } from 'react-helmet';

const Home = () => {
  const navigate = useNavigate();

  // Hardcoded recent blogs data
  const featuredBlogs = [
    {
      _id: "blog1",
      title: "Getting Started with React in 2025",
      content: "React continues to evolve with new features and improvements. In this guide, we'll explore the latest best practices for building modern React applications.",
      imageUrl: "/api/placeholder/400/250",
      readTime: "5 min read",
      tags: ["React", "JavaScript", "Web Development"],
      createdAt: "2025-02-15T10:30:00Z",
      author: {
        _id: "user1",
        name: "Alex Morgan",
        imageUrl: "/api/placeholder/40/40"
      }
    },
    {
      _id: "blog2",
      title: "The Future of AI in Content Creation",
      content: "Artificial Intelligence is transforming how we create and consume content. Discover the latest trends and tools that are shaping the future of digital content.",
      imageUrl: "/api/placeholder/400/250",
      readTime: "8 min read",
      tags: ["AI", "Content", "Technology"],
      createdAt: "2025-02-10T14:15:00Z",
      author: {
        _id: "user2",
        name: "Jamie Chen",
        imageUrl: "/api/placeholder/40/40"
      }
    },
    {
      _id: "blog3",
      title: "Building Responsive Layouts with CSS Grid",
      content: "CSS Grid has revolutionized web layout design. Learn how to create complex, responsive layouts with less code and better browser support.",
      imageUrl: "/api/placeholder/400/250",
      readTime: "6 min read",
      tags: ["CSS", "Web Design", "Frontend"],
      createdAt: "2025-02-05T09:45:00Z",
      author: {
        _id: "user3",
        name: "Taylor Wilson",
        imageUrl: "/api/placeholder/40/40"
      }
    }
  ];

  return (
    <>
      <Helmet>
        <title>Home - Blog</title>
      </Helmet>
      <div className="w-full overflow-auto max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="w-full px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Discover Insightful Stories and Ideas
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
            Your destination for thoughtful articles on technology, creativity, and everything in between. Join our community of curious minds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/blogs')}
              className="px-6 py-3 bg-[var(--color-button-primary-light)] dark:bg-[var(--color-button-primary-dark)] text-[var(--color-button-primary-text-light)] dark:text-[var(--color-button-primary-text-dark)] rounded-lg font-medium hover:bg-[var(--color-button-primary-hover-light)] dark:hover:bg-[var(--color-button-primary-hover-dark)] transition-colors"
            >
              Explore All Blogs
            </button>
            <Link
              to={""}
              className="px-6 py-3 bg-[var(--color-button-secondary-light)] dark:bg-[var(--color-button-secondary-dark)] text-[var(--color-button-secondary-text-light)] dark:text-[var(--color-button-secondary-text-dark)] border border-[var(--color-button-secondary-border-light)] dark:border-[var(--color-button-secondary-border-dark)] rounded-lg font-medium hover:bg-[var(--color-button-secondary-hover-light)] dark:hover:bg-[var(--color-button-secondary-hover-dark)] transition-colors"
            >
              Know More
            </Link>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section className="w-full px-4 py-12 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Featured Posts
              </h2>
              <button
                onClick={() => navigate('/blogs')}
                className="flex items-center text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] font-medium hover:underline"
              >
                View all <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} autherUrl={blog.author.imageUrl} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Why Join Our Community
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] hover:shadow-md transition-shadow">
                <TrendingUp className="w-12 h-12 mb-4 text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Trending Topics</h3>
                <p className="text-gray-600 dark:text-gray-400">Stay informed with the latest trends and insights from industry experts.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] hover:shadow-md transition-shadow">
                <BookOpen className="w-12 h-12 mb-4 text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Quality Content</h3>
                <p className="text-gray-600 dark:text-gray-400">Thoughtfully curated articles providing valuable insights and knowledge.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] hover:shadow-md transition-shadow">
                <Users className="w-12 h-12 mb-4 text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Vibrant Community</h3>
                <p className="text-gray-600 dark:text-gray-400">Connect with like-minded individuals and share your own perspectives.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="w-full px-4 py-16 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Subscribe to our newsletter to receive the latest updates and articles directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-button-primary-light)] dark:focus:ring-[var(--color-button-primary-dark)]"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--color-button-primary-light)] dark:bg-[var(--color-button-primary-dark)] text-[var(--color-button-primary-text-light)] dark:text-[var(--color-button-primary-text-dark)] rounded-lg font-medium hover:bg-[var(--color-button-primary-hover-light)] dark:hover:bg-[var(--color-button-primary-hover-dark)] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;