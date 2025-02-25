import React from 'react'

const getYouTubeID = (url) => {
   if (!url) return null
   const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
   )
   return match ? match[1] : null
}

const PreviewBlogForm = ({
   title,
   imageUrl,
   videoLink,
   readTime,
   slugParam,
   isPublished,
   publishedAt,
   content,
}) => {
   return (
      <div className="w-full lg:w-1/2 px-4 overflow-y-auto h-full hidden lg:block py-[2.5vh]">
         <div className="max-w-3xl mx-auto">
            {/* Blog Header */}
            <div className="mb-8">
               <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                  {imageUrl ? (
                     <img
                        src={imageUrl}
                        alt={title || 'Blog cover'}
                        className="object-cover w-full h-full"
                     />
                  ) : (
                     <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">
                           Preview cover image
                        </span>
                     </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                     <h1 className="text-3xl font-bold text-white text-center">
                        {title || 'Your blog title preview'}
                     </h1>
                  </div>
               </div>
            </div>
            {/* Blog Meta */}
            <div className="flex items-center gap-4 mb-8">
               <div className="relative h-12 w-12">
                  <img
                     src="/default-avatar.png"
                     alt="Author"
                     className="rounded-full border-2 border-white dark:border-gray-800 shadow-sm w-full h-full"
                  />
               </div>
               <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                     Author Name
                  </p>
                  <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                     <span>
                        {publishedAt
                           ? new Date(publishedAt).toLocaleDateString()
                           : new Date().toLocaleDateString()}
                     </span>
                     {readTime && <span>• {readTime}</span>}
                  </div>
               </div>
            </div>
            {/* Content Preview */}
            <article className="prose dark:prose-invert max-w-none">
               {content.map((block) => {
                  switch (block.type) {
                     case 'heading':
                        return (
                           <h2
                              key={block._id}
                              className="text-2xl font-bold text-gray-900 dark:text-white mb-5"
                           >
                              {block.value || 'Heading preview...'}
                           </h2>
                        )
                     case 'text':
                        return (
                           <p
                              key={block._id}
                              className="text-lg text-gray-800 dark:text-gray-300 mb-5"
                           >
                              {block.value || 'Start typing your content here...'}
                           </p>
                        )
                     case 'code':
                        return (
                           <pre
                              key={block._id}
                              className="bg-gray-200 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-gray-800 dark:text-gray-300 mb-5"
                           >
                              <code>{block.value}</code>
                           </pre>
                        )
                     case 'bold':
                        return (
                           <h2
                              key={block._id}
                              className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-5"
                           >
                              {block.value || 'Bold text preview...'}
                           </h2>
                        )
                     case 'highlight':
                        return (
                           <h2
                              key={block._id}
                              className="text-lg bg-yellow-300 text-black px-2 py-1 inline-block rounded mb-5"
                           >
                              {block.value || 'Highlighted text preview...'}
                           </h2>
                        )
                     default:
                        return (
                           <div key={block._id} className="text-gray-500 italic">
                              [Unsupported content type]
                           </div>
                        )
                  }
               })}
            </article>
            {/* Video Preview */}
            {videoLink && getYouTubeID(videoLink) && (
               <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
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
            )}
            {/* Empty State */}
            {content.length === 0 && (
               <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-lg">Start adding content blocks to see preview</p>
               </div>
            )}
         </div>
      </div>
   )
}

export default PreviewBlogForm
