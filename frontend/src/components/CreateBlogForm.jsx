import React, { useState, useRef } from 'react';
import { createBlog } from '../lib/api/blog.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Eye } from 'lucide-react';
import { uploadImage } from '../lib/api/auth.api';

const CreateBlogForm = ({ currentUser }) => {
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        videoLink: '',
        readTime: '',
        slugParam: '',
        imageUrl: '',
        imageId: '',
        content: ''
    });
    
    // UI state
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef(null);
    const markdownFileRef = useRef(null);

    const navigate = useNavigate();

    // Auto-generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Auto-generate slug when title changes
        if (field === 'title') {
            const slug = generateSlug(value);
            setFormData(prev => ({
                ...prev,
                slugParam: slug
            }));
        }
        
        // Clear errors for the field being edited
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!formData.slugParam.trim()) {
            newErrors.slugParam = 'Slug is required';
        }
        
        if (!formData.readTime.trim()) {
            newErrors.readTime = 'Read time is required';
        }
        
        if (!formData.videoLink.trim()) {
            newErrors.videoLink = 'Video link is required';
        }
        
        if (!formData.imageUrl || !formData.imageId) {
            newErrors.image = 'Blog image is required';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Blog content is required';
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
            toast.error('Please select a valid image file');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image file is too large (max 5MB)');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImageUrl(reader.result);
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        setUploadingImage(true);
        try {
            const result = await uploadImage(file, 'mern-blog/blogs');
            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    imageUrl: result.imageUrl,
                    imageId: result.imageId
                }));
                toast.success('Image uploaded successfully');
                if (errors.image) {
                    setErrors(prev => ({ ...prev, image: null }));
                }
            } else {
                throw new Error(result.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Please try again.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setPreviewImageUrl('');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleMarkdownFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        // Validate file type
        if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
            toast.error('Please select a valid Markdown file (.md or .markdown)');
            if (markdownFileRef.current) {
                markdownFileRef.current.value = '';
            }
            return;
        }

        // Read file content
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            setFormData(prev => ({
                ...prev,
                content: content
            }));
            toast.success('Markdown file loaded successfully');
            if (errors.content) {
                setErrors(prev => ({ ...prev, content: null }));
            }
        };
        reader.onerror = () => {
            toast.error('Failed to read the file');
        };
        reader.readAsText(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        if (uploadingImage) {
            toast.error('Please wait for image upload to complete');
            return;
        }

        setLoading(true);
        
        try {
            const blogData = {
                author: currentUser._id,
                title: formData.title.trim(),
                videoLink: formData.videoLink.trim(),
                readTime: formData.readTime.trim(),
                slugParam: formData.slugParam.trim(),
                content: formData.content.trim(),
                imageUrl: formData.imageUrl,
                imageId: formData.imageId,
            };

            const response = await createBlog(blogData);

            if (response.success) {
                toast.success('Blog created successfully!');
                navigate(`/blog/${response.blog.slugParam}`);
            } else {
                toast.error(response.message || 'Failed to create blog');
            }
        } catch (error) {
            console.error('Create blog error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Enhanced markdown preview renderer matching BlogDetails styles
    const renderMarkdownPreview = (markdown) => {
        return markdown
            .replace(/^# (.+)$/gm, '<h1 class="text-2xl sm:text-4xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-6 mt-8">$1</h1>')
            .replace(/^## (.+)$/gm, '<h2 class="text-xl sm:text-3xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-5 mt-6">$1</h2>')
            .replace(/^### (.+)$/gm, '<h3 class="text-lg sm:text-2xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4 mt-5">$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="italic text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">$1</em>')
            .replace(/`(.+?)`/g, '<code class="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] px-2 py-1 rounded text-sm font-mono text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] p-4 rounded-lg overflow-x-auto text-xs sm:text-sm border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] shadow-sm mb-4"><code class="font-mono text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">$1</code></pre>')
            .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[var(--color-accent-light)] dark:border-[var(--color-accent-dark)] pl-4 italic text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mb-4">$1</blockquote>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:underline">$1</a>')
            .replace(/^- (.+)$/gm, '<li class="mb-2 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">• $1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li class="mb-2 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">$1</li>')
            .replace(/\n\n/g, '</p><p class="text-base sm:text-lg leading-relaxed text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4">')
            .replace(/^(.+)$/gm, '<p class="text-base sm:text-lg leading-relaxed text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4">$1</p>');
    };

    return (
        <div className="min-h-screen  py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] shadow-sm hover:shadow-md transition-all duration-200 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]"
                        >
                            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]" />
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                            Create New Blog
                        </h1>
                    </div>
                    <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-button-primary-light)] dark:bg-[var(--color-button-primary-dark)] text-[var(--color-button-primary-text-light)] dark:text-[var(--color-button-primary-text-dark)] rounded-lg hover:bg-[var(--color-button-primary-hover-light)] dark:hover:bg-[var(--color-button-primary-hover-dark)] transition-colors text-sm font-medium flex-1 sm:flex-initial"
                        >
                            <Eye className="w-4 h-4" />
                            <span className="hidden xs:inline">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                            <span className="xs:hidden">{showPreview ? 'Hide' : 'Preview'}</span>
                        </button>
                    </div>
                </div>

                <div className={`grid gap-6 lg:gap-8 ${showPreview ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
                    {/* Form Column */}
                    <div className={`${showPreview ? 'order-1' : ''}`}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information Card */}
                            <div className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg shadow-sm p-6 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                                <h2 className="text-xl font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4">
                                    Basic Information
                                </h2>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                    {/* Title */}
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mb-2">
                                            Blog Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            disabled={loading}
                                            placeholder="Enter your blog title"
                                            className={`w-full rounded-lg border ${
                                                errors.title ? 'border-red-500' : 'border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'
                                            } px-4 py-3 text-sm bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] focus:ring-2 focus:ring-[var(--color-button-primary-light)] focus:border-transparent transition-colors`}
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Slug */}
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mb-2">
                                            URL Slug *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.slugParam}
                                            onChange={(e) => handleInputChange('slugParam', e.target.value)}
                                            disabled={loading}
                                            placeholder="url-friendly-slug"
                                            className={`w-full rounded-lg border ${
                                                errors.slugParam ? 'border-red-500' : 'border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'
                                            } px-4 py-3 text-sm bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] focus:ring-2 focus:ring-[var(--color-button-primary-light)] focus:border-transparent transition-colors`}
                                        />
                                        {errors.slugParam && (
                                            <p className="text-red-500 text-sm mt-1">{errors.slugParam}</p>
                                        )}
                                    </div>

                                    {/* Read Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mb-2">
                                            Read Time *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.readTime}
                                            onChange={(e) => handleInputChange('readTime', e.target.value)}
                                            disabled={loading}
                                            placeholder="e.g., 5 min read"
                                            className={`w-full rounded-lg border ${
                                                errors.readTime ? 'border-red-500' : 'border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'
                                            } px-4 py-3 text-sm bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] focus:ring-2 focus:ring-[var(--color-button-primary-light)] focus:border-transparent transition-colors`}
                                        />
                                        {errors.readTime && (
                                            <p className="text-red-500 text-sm mt-1">{errors.readTime}</p>
                                        )}
                                    </div>

                                    {/* Video Link */}
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mb-2">
                                            Video Link *
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.videoLink}
                                            onChange={(e) => handleInputChange('videoLink', e.target.value)}
                                            disabled={loading}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className={`w-full rounded-lg border ${
                                                errors.videoLink ? 'border-red-500' : 'border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'
                                            } px-4 py-3 text-sm bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] focus:ring-2 focus:ring-[var(--color-button-primary-light)] focus:border-transparent transition-colors`}
                                        />
                                        {errors.videoLink && (
                                            <p className="text-red-500 text-sm mt-1">{errors.videoLink}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload Card */}
                            <div className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg shadow-sm p-6 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                                <h2 className="text-xl font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-4">
                                    Blog Image *
                                </h2>
                                
                                <div className="space-y-4">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleImageChange}
                                        disabled={loading || uploadingImage}
                                        accept="image/*"
                                        className="w-full rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] px-4 py-3 text-sm bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--color-button-primary-light)] file:text-white hover:file:bg-[var(--color-button-primary-hover-light)] transition-colors"
                                    />
                                    
                                    {uploadingImage && (
                                        <div className="flex items-center gap-2 text-[var(--color-button-primary-light)]">
                                            <div className="animate-spin w-4 h-4 border-2 border-[var(--color-button-primary-light)] border-t-transparent rounded-full"></div>
                                            <span className="text-sm">Uploading image...</span>
                                        </div>
                                    )}
                                    
                                    {previewImageUrl && (
                                        <div className="mt-4">
                                            <img
                                                src={previewImageUrl}
                                                alt="Preview"
                                                className="h-48 w-auto object-cover rounded-lg shadow-sm border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]"
                                            />
                                        </div>
                                    )}
                                    
                                    {errors.image && (
                                        <p className="text-red-500 text-sm">{errors.image}</p>
                                    )}
                                </div>
                            </div>

                            {/* Markdown Content Card */}
                            <div className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg shadow-sm overflow-hidden border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                                <div className="p-4 sm:p-6 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                                                Blog Content (Markdown) *
                                            </h2>
                                            <p className="text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mt-1">
                                                Write in Markdown or upload a .md file
                                            </p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <input
                                                ref={markdownFileRef}
                                                type="file"
                                                onChange={handleMarkdownFileUpload}
                                                accept=".md,.markdown"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => markdownFileRef.current?.click()}
                                                disabled={loading}
                                                className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] rounded-lg hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)] transition-colors text-sm border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] flex-1 sm:flex-initial"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Upload .md
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-0">
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => handleInputChange('content', e.target.value)}
                                        disabled={loading}
                                        rows={20}
                                        placeholder={`# Your Blog Title

## Introduction
Write your introduction here...

## Main Content
You can use **bold**, *italic*, \`code\`, and other Markdown features:

- Bullet points
- More bullet points

### Code Example
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

> This is a blockquote

[Link example](https://example.com)`}
                                        className={`w-full border-0 px-4 sm:px-6 py-4 text-sm bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] focus:ring-0 focus:outline-none resize-none font-mono ${
                                            errors.content ? 'border-b-2 border-red-500' : ''
                                        } transition-colors`}
                                        style={{ minHeight: '400px' }}
                                    />
                                </div>
                                
                                {errors.content && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20">
                                        <p className="text-red-500 text-sm">{errors.content}</p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={loading}
                                    className="order-2 sm:order-1 px-6 py-3 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg text-sm font-medium text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)] transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || uploadingImage}
                                    className="order-1 sm:order-2 px-8 py-3 bg-[var(--color-button-primary-light)] dark:bg-[var(--color-button-primary-dark)] text-[var(--color-button-primary-text-light)] dark:text-[var(--color-button-primary-text-dark)] rounded-lg text-sm font-medium hover:bg-[var(--color-button-primary-hover-light)] dark:hover:bg-[var(--color-button-primary-hover-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading && (
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    )}
                                    {loading ? 'Creating Blog...' : 'Create Blog'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Column */}
                    {showPreview && (
                        <div className="order-2 xl:sticky xl:top-8 xl:max-h-screen xl:overflow-y-auto">
                            <div className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg shadow-sm border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] h-fit">
                                {/* Preview Header */}
                                <div className="p-4 sm:p-6 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="w-5 h-5 text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]" />
                                        <h3 className="text-lg font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
                                            Live Preview
                                        </h3>
                                    </div>
                                    
                                    {/* Blog Header Preview */}
                                    {formData.title && (
                                        <div className="mb-6">
                                            <div className="relative w-full h-32 sm:h-40 rounded-lg overflow-hidden shadow-sm bg-gradient-to-r from-blue-500 to-purple-600">
                                                {previewImageUrl ? (
                                                    <img
                                                        src={previewImageUrl}
                                                        alt={formData.title}
                                                        className="w-full h-full object-cover brightness-75"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
                                                )}
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <h1 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center px-4 leading-tight">
                                                        {formData.title || 'Your Blog Title'}
                                                    </h1>
                                                </div>
                                            </div>
                                            
                                            {/* Meta Information */}
                                            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                                                {formData.readTime && (
                                                    <span className="flex items-center gap-1">
                                                        📖 {formData.readTime}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    📅 {new Date().toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                {formData.slugParam && (
                                                    <span className="flex items-center gap-1 text-xs bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] px-2 py-1 rounded break-all">
                                                        🔗 /{formData.slugParam}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Content Preview */}
                                <div className="p-4 sm:p-6">
                                    {formData.content ? (
                                        <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
                                            <div 
                                                className="space-y-4"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: renderMarkdownPreview(formData.content) 
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12">
                                            <FileText className="w-10 sm:w-12 h-10 sm:h-12 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mx-auto mb-4" />
                                            <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] italic text-sm sm:text-base">
                                                Start writing to see the preview...
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Video Preview */}
                                {formData.videoLink && (
                                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                                        <div className="border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] pt-4 sm:pt-6">
                                            <h4 className="text-sm font-medium text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mb-3">
                                                📹 Video Content
                                            </h4>
                                            <div className="bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] rounded-lg p-3 sm:p-4 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                                                <p className="text-xs sm:text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] break-all">
                                                    {formData.videoLink}
                                                </p>
                                                {formData.videoLink.includes('youtube.com') || formData.videoLink.includes('youtu.be') ? (
                                                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                                        ✅ Valid YouTube URL detected
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                                        ⚠️ Please ensure this is a valid video URL
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateBlogForm;