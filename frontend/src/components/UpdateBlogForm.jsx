import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { uploadImage } from '../lib/api/auth.api';

const UpdateBlogForm = ({ currentUser, initialData, onSubmit, isLoading }) => {
   // Form state - initialize with existing blog data
   const [formData, setFormData] = useState({
      title: initialData?.title || '',
      videoLink: initialData?.videoLink || '',
      readTime: initialData?.readTime || '',
      slugParam: initialData?.slugParam || '',
      imageUrl: initialData?.imageUrl || '',
      imageId: initialData?.imageId || '',
      content: initialData?.content || ''
   });

   // UI state
   const [errors, setErrors] = useState({});
   const [uploadingImage, setUploadingImage] = useState(false);
   const [previewImageUrl, setPreviewImageUrl] = useState(initialData?.imageUrl || '');
   const [showPreview, setShowPreview] = useState(false);
   const [willUpdateSlugParams, setWillUpdateSlugParams] = useState('');
   const fileInputRef = useRef(null);
   const markdownFileRef = useRef(null);

   // Update form data when initialData changes
   useEffect(() => {
      if (initialData) {
         setFormData({
            title: initialData.title || '',
            videoLink: initialData.videoLink || '',
            readTime: initialData.readTime || '',
            slugParam: initialData.slugParam || '',
            imageUrl: initialData.imageUrl || '',
            imageId: initialData.imageId || '',
            content: initialData.content || ''
         });
         setPreviewImageUrl(initialData.imageUrl || '');
      }
   }, [initialData]);

   // Auto-generate slug from title
   const generateSlug = (title) => {
      return title
         .toLowerCase()
         .replace(/[^a-zA-Z0-9\s]/g, '')
         .replace(/\s+/g, '-')
         .trim();
   };

   const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));

      // Auto-generate slug when title changes
      if (field === 'title') {
         const newSlug = generateSlug(value);
         setWillUpdateSlugParams(newSlug);
      }

      // Clear errors for the field being edited
      if (errors[field]) {
         setErrors(prev => ({ ...prev, [field]: '' }));
      }
   };

   const validateForm = () => {
      const newErrors = {};

      if (!formData.title.trim()) {
         newErrors.title = 'Title is required';
      }
      if (!formData.videoLink.trim()) {
         newErrors.videoLink = 'Video link is required';
      }
      if (!formData.readTime) {
         newErrors.readTime = 'Read time is required';
      }
      if (!formData.content.trim()) {
         newErrors.content = 'Content is required';
      }
      if (!previewImageUrl) {
         newErrors.image = 'Blog image is required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
         return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
         setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
         toast.error('Please select a valid image file');
         return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
         setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
         toast.error('Image file is too large (max 5MB)');
         return;
      }

      setUploadingImage(true);
      try {
         // For simplicity, we'll just replace the image without deleting the old one
         // In a production app, you might want to implement a delete endpoint

         const result = await uploadImage(file);
         if (result.success) {
            setFormData(prev => ({
               ...prev,
               imageUrl: result.imageUrl,
               imageId: result.imageId
            }));
            setPreviewImageUrl(result.imageUrl);
            setErrors(prev => ({ ...prev, image: '' }));
            toast.success('Image uploaded successfully');
         } else {
            setErrors(prev => ({ ...prev, image: result.message }));
            toast.error(result.message || 'Failed to upload image');
         }
      } catch (error) {
         setErrors(prev => ({ ...prev, image: 'Failed to upload image' }));
         toast.error('Failed to upload image. Please try again.');
      } finally {
         setUploadingImage(false);
      }
   };

   const handleMarkdownFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) {
         return;
      }

      if (file.type !== 'text/markdown' && !file.name.endsWith('.md')) {
         setErrors(prev => ({ ...prev, markdown: 'Please select a markdown file (.md)' }));
         toast.error('Please select a valid Markdown file (.md or .markdown)');
         return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
         const content = event.target.result;
         setFormData(prev => ({ ...prev, content }));
         setErrors(prev => ({ ...prev, content: '', markdown: '' }));
         toast.success('Markdown file loaded successfully');
      };
      reader.onerror = () => {
         setErrors(prev => ({ ...prev, markdown: 'Failed to read the file' }));
         toast.error('Failed to read the file');
      };
      reader.readAsText(file);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      // Prepare update data - only include changed fields
      const updateData = {};

      if (formData.title !== initialData.title) {
         updateData.title = formData.title;
      }
      if (formData.videoLink !== initialData.videoLink) {
         updateData.videoLink = formData.videoLink;
      }
      if (formData.readTime !== initialData.readTime) {
         updateData.readTime = formData.readTime;
      }
      if (formData.content !== initialData.content) {
         updateData.content = formData.content;
      }
      if (formData.imageUrl !== initialData.imageUrl) {
         updateData.imageUrl = formData.imageUrl;
      }
      if (formData.imageId !== initialData.imageId) {
         updateData.imageId = formData.imageId;
      }
      if (willUpdateSlugParams && willUpdateSlugParams !== initialData.slugParam) {
         updateData.willUpdateSlugParams = willUpdateSlugParams;
      }

      // Only submit if there are actual changes
      if (Object.keys(updateData).length === 0) {
         setErrors({ general: 'No changes detected' });
         toast.info('No changes to update');
         return;
      }

      onSubmit(updateData);
   };

   // Enhanced markdown preview renderer matching BlogDetails styles
   const renderMarkdownPreview = (markdown) => {
      return (
         <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <ReactMarkdown
               remarkPlugins={[remarkGfm]}
               rehypePlugins={[rehypeHighlight]}
               components={{
                  p: ({ children }) => (
                     <p className="text-base sm:text-lg leading-relaxed text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4">
                        {children}
                     </p>
                  ),
                  h1: ({ children }) => (
                     <h1 className="text-2xl sm:text-4xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-6 mt-8">
                        {children}
                     </h1>
                  ),
                  h2: ({ children }) => (
                     <h2 className="text-xl sm:text-3xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-5 mt-6">
                        {children}
                     </h2>
                  ),
                  h3: ({ children }) => (
                     <h3 className="text-lg sm:text-2xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4 mt-5">
                        {children}
                     </h3>
                  ),
                  strong: ({ children }) => (
                     <strong className="font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                        {children}
                     </strong>
                  ),
                  code: ({ inline, children }) => {
                     if (inline) {
                        return (
                           <code className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] px-1 py-0.5 rounded text-sm font-mono border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                              {children}
                           </code>
                        );
                     }
                     return (
                        <code className="font-mono text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                           {children}
                        </code>
                     );
                  },
                  pre: ({ children }) => (
                     <pre className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] p-4 rounded-lg overflow-x-auto text-xs sm:text-sm border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shadow-sm mb-4">
                        {children}
                     </pre>
                  ),
                  blockquote: ({ children }) => (
                     <blockquote className="border-l-4 border-[var(--color-accent-light)] dark:border-[var(--color-accent-dark)] pl-4 italic text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mb-4">
                        {children}
                     </blockquote>
                  ),
                  a: ({ href, children }) => (
                     <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:underline"
                     >
                        {children}
                     </a>
                  ),
                  ul: ({ children }) => (
                     <ul className="list-disc list-inside mb-4 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                        {children}
                     </ul>
                  ),
                  ol: ({ children }) => (
                     <ol className="list-decimal list-inside mb-4 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                        {children}
                     </ol>
                  ),
                  li: ({ children }) => (
                     <li className="mb-2">{children}</li>
                  ),
               }}
            >
               {markdown}
            </ReactMarkdown>
         </div>
      );
   };

   return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
         <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
               <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                  {errors.general}
               </div>
            )}

            {/* Title */}
            <div className="space-y-2">
               <label className="block text-sm font-medium">
                  Blog Title *
               </label>
               <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg
                                 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]
                                 focus:ring-2 focus:ring-[var(--color-accent-light)] dark:focus:ring-[var(--color-accent-dark)] focus:border-transparent"
                  placeholder="Enter blog title..."
               />
               {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            {/* Current and New Slug */}
            <div className="space-y-2">
               <label className="block text-sm font-medium">Current Slug</label>
               <input
                  type="text"
                  value={formData.slugParam}
                  disabled
                  className="w-full px-3 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg 
                                 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
               />
               {willUpdateSlugParams && (
                  <>
                     <label className="block text-sm font-medium text-blue-600 dark:text-blue-400">
                        New Slug (auto-generated)
                     </label>
                     <input
                        type="text"
                        value={willUpdateSlugParams}
                        onChange={(e) => setWillUpdateSlugParams(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg 
                                         bg-blue-50 dark:bg-blue-900/20 
                                         text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]"
                     />
                  </>
               )}
            </div>

            {/* Video Link and Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="block text-sm font-medium">
                     Video Link *
                  </label>
                  <input
                     type="url"
                     value={formData.videoLink}
                     onChange={(e) => handleInputChange('videoLink', e.target.value)}
                     className="w-full px-3 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg 
                                     text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]
                                     focus:ring-2 focus:ring-[var(--color-accent-light)] dark:focus:ring-[var(--color-accent-dark)] focus:border-transparent"
                     placeholder="https://youtube.com/watch?v=..."
                  />
                  {errors.videoLink && <p className="text-red-500 text-sm">{errors.videoLink}</p>}
               </div>

               <div className="space-y-2">
                  <label className="block text-sm font-medium">
                     Read Time (minutes) *
                  </label>
                  <input
                     type="number"
                     value={formData.readTime}
                     onChange={(e) => handleInputChange('readTime', e.target.value)}
                     className="w-full px-3 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg
                                     text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]
                                     focus:ring-2 focus:ring-[var(--color-accent-light)] dark:focus:ring-[var(--color-accent-dark)] focus:border-transparent"
                     placeholder="5"
                     min="1"
                  />
                  {errors.readTime && <p className="text-red-500 text-sm">{errors.readTime}</p>}
               </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
               <label className="block text-sm font-medium">
                  Blog Image *
               </label>
               <div className="flex items-center gap-4">
                  <input
                     type="file"
                     ref={fileInputRef}
                     onChange={handleImageChange}
                     accept="image/*"
                     className="hidden"
                  />
                  <button
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     disabled={uploadingImage}
                     className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg
                                     text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]
                                     hover:bg-[var(--color-surface-light)] dark:hover:bg-[var(--color-surface-dark)] 
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {uploadingImage ? (
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                     ) : (
                        <Upload className="w-4 h-4" />
                     )}
                     {uploadingImage ? 'Uploading...' : 'Change Image'}
                  </button>

                  {previewImageUrl && (
                     <div className="relative">
                        <img
                           src={previewImageUrl}
                           alt="Preview"
                           className="w-20 h-20 object-cover rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]"
                        />
                     </div>
                  )}
               </div>
               {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            </div>

            {/* Content */}
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                     Blog Content * (Markdown)
                  </label>
                  <div className="flex items-center gap-2">
                     <input
                        type="file"
                        ref={markdownFileRef}
                        onChange={handleMarkdownFileUpload}
                        accept=".md,.markdown"
                        className="hidden"
                     />
                     <button
                        type="button"
                        onClick={() => markdownFileRef.current?.click()}
                        className="flex items-center gap-1 px-3 py-1 text-xs border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded 
                                         text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]
                                         hover:bg-[var(--color-surface-light)] dark:hover:bg-[var(--color-surface-dark)]"
                     >
                        <FileText className="w-3 h-3" />
                        Import .md
                     </button>
                     <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-1 px-3 py-1 text-xs border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded
                                         text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]
                                         hover:bg-[var(--color-surface-light)] dark:hover:bg-[var(--color-surface-dark)]"
                     >
                        {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showPreview ? 'Edit' : 'Preview'}
                     </button>
                  </div>
               </div>

               {errors.markdown && <p className="text-red-500 text-sm">{errors.markdown}</p>}

               {showPreview ? (
                  <div className="min-h-[300px] p-4 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg">
                     {formData.content ? renderMarkdownPreview(formData.content) : (
                        <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] italic">
                           No content to preview
                        </p>
                     )}
                  </div>
               ) : (
                  <textarea
                     value={formData.content}
                     onChange={(e) => handleInputChange('content', e.target.value)}
                     rows={15}
                     className="w-full px-3 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg
                                     text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]
                                     focus:ring-2 focus:ring-[var(--color-accent-light)] dark:focus:ring-[var(--color-accent-dark)] focus:border-transparent
                                     font-mono text-sm"
                     placeholder="Write your blog content in Markdown..."
                  />
               )}
               {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
               <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--color-button-primary-light)] dark:bg-[var(--color-button-primary-dark)] 
                                 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-opacity"
               >
                  {isLoading && <LoaderCircle className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Updating...' : 'Update Blog'}
               </button>
            </div>
         </form>
      </div>
   );
};

export default UpdateBlogForm;
