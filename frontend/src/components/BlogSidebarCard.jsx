import React from "react";
import { CircleUser, FacebookIcon } from 'lucide-react';

export default function BlogSidebarCard({ author }) {
   return (
      <aside className="w-full md:w-64 p-6 rounded-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] shadow-sm">
         <h3 className="text-xl font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4">
            Author
         </h3>
         <div className="flex items-center space-x-3">
            {author.imageUrl ? (
               <img
                  src={author.imageUrl || '/default-avatar.png'}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]"
               />
            ) : (
               <CircleUser className="w-10 h-10" />
            )}
            <span className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
               {author.name}
            </span>
         </div>

         <div className="mt-6">
            <button className="flex items-center text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] hover:text-[var(--color-text-primary-light)] dark:hover:text-[var(--color-text-primary-dark)] space-x-2">
               <FacebookIcon />
               <span>Bookmark</span>
            </button>
            <h4 className="mt-4 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
               Share With
            </h4>
            <div className="flex space-x-3 mt-2">
               {/* Add social share icons or links here */}
            </div>
         </div>
      </aside>
   );
}
