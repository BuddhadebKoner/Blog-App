import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog, className = '' }) => {
   return (
      <div className={`bg-white dark:bg-[var(--color-background-dark)] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
         <Link to={`/blog/${blog.slugParam}`} className="block h-full">
            {blog.imageUrl && (
               <div className="blog-image h-36 sm:h-48 overflow-hidden">
                  <img
                     src={blog.imageUrl}
                     alt={blog.title}
                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                     loading="lazy"
                  />
               </div>
            )}
            <div className="p-3 sm:p-4">
               <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                  {blog.title}
               </h3>

               {/* Author info */}
               <div className="flex items-center mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-2 flex-shrink-0">
                     {
                        blog.author?.imageUrl ? (
                           <img
                              src={blog.author.imageUrl}
                              alt={blog.author.name}
                              className="w-full h-full object-cover rounded-full"
                              loading="lazy"
                           />
                        ) : (
                           <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {blog.author?.name?.charAt(0) || "?"}
                           </span>
                        )
                     }
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate max-w-[calc(100%-2rem)]">
                     {blog.author?.name || "Anonymous"}
                  </span>
               </div>

               {/* Blog meta info */}
               <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-[11px] sm:text-xs">{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                     year: 'numeric',
                     month: 'short',
                     day: 'numeric'
                  })}</span>
                  {blog.readTime && <span className="text-[11px] sm:text-xs">{blog.readTime} read</span>}
               </div>
            </div>
         </Link>
      </div>
   );
};

export default BlogCard;