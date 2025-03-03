import React from "react";
import { CircleUser, FacebookIcon, Twitter, Linkedin, Mail, ShieldCheck } from 'lucide-react';
import { Link } from "react-router-dom";

export default function BlogSidebarCard({ author, blogUrl, blogTitle }) {
   // Get the current URL and title if not provided as props
   const url = blogUrl || window.location.href;
   const title = blogTitle || document.title;

   // Function to handle Facebook sharing
   const handleFacebookShare = (e) => {
      e.preventDefault();
      const encodedUrl = encodeURIComponent(url);
      const encodedTitle = encodeURIComponent(title);

      window.open(
         `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
         'facebook-share-dialog',
         'width=626,height=436'
      );
   };

   // Function to handle Twitter sharing
   const handleTwitterShare = (e) => {
      e.preventDefault();
      const encodedUrl = encodeURIComponent(url);
      const encodedTitle = encodeURIComponent(title);

      window.open(
         `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
         'twitter-share-dialog',
         'width=550,height=420'
      );
   };

   // Function to handle LinkedIn sharing
   const handleLinkedInShare = (e) => {
      e.preventDefault();
      const encodedUrl = encodeURIComponent(url);
      const encodedTitle = encodeURIComponent(title);

      window.open(
         `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
         'linkedin-share-dialog',
         'width=600,height=600'
      );
   };

   return (
      <aside className="w-full md:w-64 p-6 rounded-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] shadow-sm">
         <h3 className="text-xl font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4">
            Author
         </h3>
         <Link
            className="flex items-center space-x-3 group hover:opacity-90 transition-opacity duration-200"
            to={`/profile/${author?._id}`}
         >
            {author?.imageUrl ? (
               <img
                  src={author.imageUrl || '/default-avatar.png'}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] transition-transform duration-200 group-hover:scale-105"
               />
            ) : (
               <CircleUser className="w-10 h-10 transition-transform duration-200 group-hover:scale-105" />
            )}
            <span className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] flex justify-start items-center gap-2 group-hover:text-[var(--color-primary-light)] dark:group-hover:text-[var(--color-primary-dark)] transition-colors duration-200">
               {author?.name}
               {author?.verified && (
                  <ShieldCheck className="w-4 h-4 text-blue-500" title="Verified Author" />
               )}
            </span>
         </Link>
         <div className="mt-6">
            <h4 className="mt-4 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
               Share With
            </h4>
            <div className="flex space-x-3 mt-2">
               <button
                  className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer transform hover:scale-110"
                  onClick={handleFacebookShare}
                  aria-label="Share on Facebook"
                  title="Share on Facebook"
               >
                  <FacebookIcon className="w-5 h-5" />
               </button>
               <button
                  className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer transform hover:scale-110"
                  onClick={handleTwitterShare}
                  aria-label="Share on Twitter"
                  title="Share on Twitter"
               >
                  <Twitter className="w-5 h-5" />
               </button>
               <button
                  className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer transform hover:scale-110"
                  onClick={handleLinkedInShare}
                  aria-label="Share on LinkedIn"
                  title="Share on LinkedIn"
               >
                  <Linkedin className="w-5 h-5" />
               </button>
            </div>
         </div>
      </aside>
   );
}