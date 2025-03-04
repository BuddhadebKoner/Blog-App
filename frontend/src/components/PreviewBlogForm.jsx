import React from 'react'
import { CircleUser } from 'lucide-react'
import { convertUrlsToLinks } from '../lib/utils'

const getYouTubeID = (url) => {
   if (!url) return null
   const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
   )
   return match ? match[1] : null
}

const PreviewBlogForm = ({
   className,
   title,
   videoLink,
   readTime,
   currentUser,
   isAuthenticatedLoading,
   content = [],
   imageUrl
}) => {

   // restrict all mouse clicks and disable mode
   const handleMouseDown = (e) => {
      e.preventDefault()
   }

   return (
      <div className={`${className} w-full lg:w-1/2 px-2 sm:px-4 overflow-auto h-full block py-[2vh] sm:py-[2.5vh]`} onMouseDown={handleMouseDown}>
         <div className="max-w-3xl mx-auto">
            {/* Blog Header */}
            <div className="mb-4 sm:mb-6 md:mb-8">
               <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg">
                  {
                     imageUrl ? (
                        <img
                           src={imageUrl}
                           alt={title || 'Blog cover'}
                           className="object-cover w-full h-full"
                        />
                     ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                           <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                              Preview cover image
                           </span>
                        </div>
                     )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3 sm:p-4">
                     <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
                        {title || 'Your blog title preview'}
                     </h1>
                  </div>
               </div>
            </div>
            {/* Blog Meta */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
               <div className="relative h-10 w-10 sm:h-12 sm:w-12">
                  {currentUser?.imageUrl ? (
                     <img
                        src={currentUser.imageUrl}
                        alt={currentUser?.name}
                        className="rounded-full border-2 border-white dark:border-gray-800 shadow-sm w-full h-full"
                     />
                  ) : (
                     <CircleUser className="rounded-full border-2 border-white dark:border-gray-800 shadow-sm w-full h-full" />
                  )}
               </div>
               <div>
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
                     {currentUser?.name || 'Author name preview'}
                  </p>
                  <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                     <span>
                        {new Date().toLocaleDateString('en-IN', {
                           month: 'long',
                           day: 'numeric',
                           year: 'numeric'
                        })}
                     </span>
                     {readTime && <span>• {readTime}</span>}
                  </div>
               </div>
            </div>
            {/* Content Preview */}
            <article className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
               {content.map((block) => {
                  switch (block.type) {
                     case 'heading':
                        return (
                           <h2
                              key={block._id}
                              className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-3 sm:mb-5"
                           >
                              {block.value || 'Heading preview...'}
                           </h2>
                        )
                     case 'text':
                        return (
                           <p
                              key={block._id}
                              className="text-base sm:text-lg text-gray-800 dark:text-gray-300 mb-3 sm:mb-5"
                           >
                              {convertUrlsToLinks(block.value, 'text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:underline') || 'Text preview...'}
                           </p>
                        )
                     case 'code':
                        return (
                           <pre
                              key={block._id}
                              className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] p-2 sm:p-3 rounded-lg overflow-x-auto text-xs sm:text-sm border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shadow-sm mb-3 sm:mb-5"
                           >
                              <code
                                 className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] font-mono"
                              >
                                 {convertUrlsToLinks(block.value, 'text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]') || 'Code preview...'}
                              </code>
                           </pre>
                        )
                     case 'bold':
                        return (
                           <h2
                              key={block._id}
                              className="text-base sm:text-lg font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-3 sm:mb-5"
                           >
                              {block.value || 'Bold text preview...'}
                           </h2>
                        )
                     case 'highlight':
                        return (
                           <span
                              key={block._id}
                              className="text-base sm:text-lg bg-[var(--color-accent-light)] dark:bg-[var(--color-accent-dark)] text-[var(--color-background-light)] dark:text-[var(--color-background-dark)] px-2 sm:px-3 py-0.5 sm:py-1 rounded-md inline-block mb-3 sm:mb-5"
                           >
                              {block.value || 'Highlighted text preview...'}
                           </span>
                        )
                     default:
                        return (
                           <div key={block._id} className="text-gray-500 italic text-sm sm:text-base">
                              [Unsupported content type]
                           </div>
                        )
                  }
               })}
            </article>
            {/* Video Preview */}
            {
               videoLink && getYouTubeID(videoLink) && (
                  <div className="mt-6 sm:mt-8 md:mt-12 rounded-xl overflow-hidden shadow-lg">
                     <div className="aspect-video bg-gray-200 dark:bg-gray-800">
                        <iframe
                           className="w-full h-full"
                           src={`https://www.youtube.com/embed/${getYouTubeID(videoLink)}`}
                           title="YouTube video player"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowFullScreen
                        />
                     </div>
                  </div>
               )
            }
            {/* Empty State */}
            {
               content.length === 0 && (
                  <div className="text-center py-6 sm:py-8 md:py-12 text-gray-500 dark:text-gray-400">
                     <p className="text-base sm:text-lg">Start adding content blocks to see preview</p>
                  </div>
               )
            }
         </div>
      </div>
   )
}

export default PreviewBlogForm