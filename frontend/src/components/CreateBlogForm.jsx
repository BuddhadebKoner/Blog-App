import React, { useState } from 'react'

const CreateBlogForm = ({
   title,
   setTitle,
   imageUrl,
   setImageUrl,
   imageId,
   setImageId,
   videoLink,
   setVideoLink,
   readTime,
   setReadTime,
   slugParam,
   setSlugParam,
   isPublished,
   setIsPublished,
   publishedAt,
   setPublishedAt,
   content,
   setContent
}) => {
   const [errors, setErrors] = useState({})
   const [loading, setLoading] = useState(false)
   const [serverError, setServerError] = useState(null)

   const addContentBlock = () => {
      setContent([...content, { _id: Date.now().toString(), type: '', value: '' }])
   }

   const handleContentTypeChange = (index, type) => {
      const updated = [...content]
      updated[index].type = type
      setContent(updated)
   }

   const handleContentValueChange = (index, value) => {
      const updated = [...content]
      updated[index].value = value
      setContent(updated)
   }

   const removeContentBlock = (index) => {
      const updated = content.filter((_, i) => i !== index)
      setContent(updated)
   }

   const validateForm = () => {
      const newErrors = {}
      if (!title.trim()) newErrors.title = 'Title is required'
      if (!slugParam.trim()) newErrors.slugParam = 'Slug is required'

      content.forEach((block, index) => {
         if (!block.type) {
            newErrors[`contentType-${index}`] = 'Content type is required'
         }
         if (!block.value.trim()) {
            newErrors[`contentValue-${index}`] = 'Content value is required'
         }
      })

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      setServerError(null)

      if (!validateForm()) return

      setLoading(true)

      const blogData = {
         title,
         imageUrl,
         imageId,
         videoLink,
         readTime,
         slugParam,
         isPublished,
         publishedAt,
         content,
      }

      console.log('Blog Data Submitted:', blogData)
      // Optionally reset the form or show a success message.
      setTimeout(() => {
         setLoading(false)
      }, 1000)
   }

   return (
      <div className="w-full lg:w-1/2 px-4 overflow-y-auto h-full py-[2.5vh]">
         <h1 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">
            Create New Blog
         </h1>
         <form onSubmit={handleSubmit} className="space-y-4 overflow-auto">
            {serverError && (
               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {serverError}
               </div>
            )}

            {/* Title */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
               </label>
               <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  className={`w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} p-2 bg-white dark:bg-gray-800`}
               />
               {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Image URL */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image URL
               </label>
               <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800"
               />
            </div>

            {/* Image ID */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image ID
               </label>
               <input
                  type="text"
                  value={imageId}
                  onChange={(e) => setImageId(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800"
               />
            </div>

            {/* Video Link */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Video Link
               </label>
               <input
                  type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800"
               />
            </div>

            {/* Read Time */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Read Time
               </label>
               <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  disabled={loading}
                  placeholder="e.g., 5 min read"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800"
               />
            </div>

            {/* Slug Param */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug Param *
               </label>
               <input
                  type="text"
                  value={slugParam}
                  onChange={(e) => setSlugParam(e.target.value)}
                  disabled={loading}
                  className={`w-full rounded-md border ${errors.slugParam ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} p-2 bg-white dark:bg-gray-800`}
               />
               {errors.slugParam && <p className="text-red-500 text-sm mt-1">{errors.slugParam}</p>}
            </div>

            {/* Is Published */}
            <div className="flex items-center">
               <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  disabled={loading}
                  className="mr-2"
               />
               <label className="text-sm text-gray-700 dark:text-gray-300">Published</label>
            </div>

            {/* Published At */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Published At
               </label>
               <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800"
               />
            </div>

            {/* Content Blocks */}
            <div className="space-y-4">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content Blocks *
               </label>
               {content.map((block, index) => (
                  <div
                     key={block._id}
                     className="mb-4 p-4 border rounded-md dark:border-gray-600"
                  >
                     <div className="mb-2">
                        <select
                           value={block.type}
                           onChange={(e) =>
                              handleContentTypeChange(index, e.target.value)
                           }
                           disabled={loading}
                           className={`w-full rounded-md border ${errors[`contentType-${index}`]
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-gray-600'} p-2 bg-white dark:bg-gray-800`}
                        >
                           <option value="">Select Content Type</option>
                           <option value="heading">Heading</option>
                           <option value="text">Text</option>
                           <option value="code">Code</option>
                           <option value="bold">Bold</option>
                           <option value="highlight">Highlight</option>
                        </select>
                        {errors[`contentType-${index}`] && (
                           <p className="text-red-500 text-sm mt-1">
                              {errors[`contentType-${index}`]}
                           </p>
                        )}
                     </div>
                     <div className="mb-2">
                        <textarea
                           value={block.value}
                           onChange={(e) =>
                              handleContentValueChange(index, e.target.value)
                           }
                           disabled={loading}
                           rows={4}
                           placeholder="Enter content..."
                           className={`w-full rounded-md border ${errors[`contentValue-${index}`]
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-gray-600'} p-2 bg-white dark:bg-gray-800`}
                        />
                        {errors[`contentValue-${index}`] && (
                           <p className="text-red-500 text-sm mt-1">
                              {errors[`contentValue-${index}`]}
                           </p>
                        )}
                     </div>
                     <button
                        type="button"
                        onClick={() => removeContentBlock(index)}
                        disabled={loading}
                        className="text-red-500 text-sm hover:text-red-700"
                     >
                        Remove Block
                     </button>
                  </div>
               ))}
               <button
                  type="button"
                  onClick={addContentBlock}
                  disabled={loading}
                  className="w-full py-2 mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 border border-dashed border-gray-300 dark:border-gray-600 rounded-md"
               >
                  + Add Content Block
               </button>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-6">
               <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-green-500 dark:bg-green-400 text-white rounded-lg transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 dark:hover:bg-green-500'}`}
               >
                  {loading ? 'Saving...' : 'Save Blog'}
               </button>
            </div>
         </form>
      </div>
   )
}

export default CreateBlogForm