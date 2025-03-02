import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog, className = '' }) => {
   return (
      <div className={`bg-white dark:bg-[var(--color-background-dark)] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
         <Link to={`/blog/${blog.slugParam}`}>
            {blog.imageUrl && (
               <div className="blog-image h-48 overflow-hidden">
                  <img
                     src={blog.imageUrl}
                     alt={blog.title}
                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
               </div>
            )}
            <div className="p-4">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{blog.title}</h3>

               {/* Author info */}
               <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-2">
                     {
                        blog.author?.imageUrl ? (
                           <img
                              src={blog.author.imageUrl}
                              alt={blog.author.name}
                              className="w-full h-full object-cover rounded-full"
                           />
                        ) : (
                           <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {blog.author?.name?.charAt(0) || "?"}
                           </span>
                        )
                     }
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                     {blog.author?.name || "Anonymous"}
                  </span>
               </div>

               {/* Blog meta info */}
               <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                     year: 'numeric',
                     month: 'short',
                     day: 'numeric'
                  })}</span>
                  {blog.readTime && <span>{blog.readTime} read</span>}
               </div>
            </div>
         </Link>
      </div>
   );
};

export default BlogCard;