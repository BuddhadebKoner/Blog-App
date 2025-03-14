import React, { useState, useRef } from 'react';
import { createBlog } from '../lib/api/blog.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { uploadImage } from '../lib/api/auth.api';

const CreateBlogForm = ({
    title,
    setTitle,
    videoLink,
    setVideoLink,
    readTime,
    setReadTime,
    slugParam,
    setSlugParam,
    content,
    setContent,
    imageUrl,
    setImageUrl,
    currentUser,
    setLoading,
    loading,
}) => {
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageId, setImageId] = useState('');
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const addContentBlock = () => {
        setContent([
            ...content,
            { tempId: Date.now().toString(), type: '', value: '' },
        ]);
    };

    const handleContentTypeChange = (index, type) => {
        const updated = [...content];
        updated[index].type = type;
        setContent(updated);
    };

    const handleContentValueChange = (index, value) => {
        const updated = [...content];
        updated[index].value = value;
        setContent(updated);
    };

    const removeContentBlock = (index) => {
        const updated = content.filter((_, i) => i !== index);
        setContent(updated);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!slugParam.trim()) newErrors.slugParam = 'Slug is required';

        content.forEach((block, index) => {
            if (!block.type) {
                newErrors[`contentType-${index}`] = 'Content type is required';
            }
            if (!block.value.trim()) {
                newErrors[`contentValue-${index}`] = 'Content value is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlogImageChange = async (e) => {
        setErrors({ ...errors, blogImage: null });
        const file = e.target.files[0];

        if (!file) {
            console.log('No file selected');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file (JPEG, PNG, etc.)');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image file is too large (max 5MB)');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Show a local preview (for immediate feedback)
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImageUrl(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload the file to Cloudinary
        await uploadToCloudinary(file);
    };

    const uploadToCloudinary = async (file) => {
        setUploadingImage(true);
        const path = 'mern-blog/blogs';

        try {
            const result = await uploadImage(file, path);
            if (!result.success) {
                throw new Error(result.message || 'Failed to upload blog image');
            }
            // Store the Cloudinary image URL and public_id
            setImageUrl(result.imageUrl);
            setImageId(result.imageId);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            toast.error('Failed to upload image. Please try again.');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);

        if (!validateForm()) return;

        setLoading(true);

        // Prevent submission while image upload is in progress
        if (uploadingImage) {
            toast.error('Please wait for image upload to complete.');
            setLoading(false);
            return;
        }

        // Ensure image upload has completed and data exists
        if (!imageId || !imageUrl) {
            toast.error('Image is required.');
            setLoading(false);
            return;
        }

        try {
            // Remove temporary keys from content blocks
            const sanitizedContent = content.map(({ tempId, _id, ...rest }) => rest);

            const blogData = {
                author: currentUser._id,
                title,
                videoLink,
                readTime,
                slugParam,
                content: JSON.stringify(sanitizedContent),
                imageUrl,
                imageId,
            };

            // console.log('Final Blog Data:', blogData);

            const res = await createBlog(blogData);

            if (res.success) {
                toast.success('Blog created successfully');
                navigate(`/blog/${res.blog.slugParam}`);
                // Reset or clear fields as needed
                setTitle('');
                // Optionally reset other form states
            } else {
                toast.error(res.message || 'Something went wrong');
                setServerError(res.message || 'Failed to create blog');
                console.log('Server Response Error:', res);
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            toast.error('Something went wrong while creating the blog');
            setServerError('Failed to create blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-3 sm:px-4 py-[2vh] sm:py-[2.5vh] w-full max-w-3xl mx-auto lg:w-3/4 xl:w-1/2 overflow-y-auto h-full">
            <div className="w-full flex items-center justify-start mb-4 sm:mb-6 gap-2 sm:gap-3">
                <ArrowLeft
                    onClick={() => navigate(-1)}
                    className="w-5 h-5 sm:w-6 sm:h-6 inline-block cursor-pointer"
                />
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    Create New Blog
                </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 overflow-auto">
                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm">
                        {serverError}
                    </div>
                )}
                {/* Title */}
                <div className="px-0 sm:px-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                        className={`w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } p-2 text-sm bg-white dark:bg-gray-800`}
                    />
                    {errors.title && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.title}</p>}
                </div>
                {/* Blog Image */}
                <div className="px-0 sm:px-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Blog Image
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleBlogImageChange}
                        disabled={loading || uploadingImage}
                        accept="image/*"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-1.5 sm:p-2 text-xs sm:text-sm bg-white dark:bg-gray-800"
                    />
                    {uploadingImage && (
                        <p className="text-blue-500 text-xs sm:text-sm mt-1">Uploading image...</p>
                    )}
                </div>
                {/* Video Link */}
                <div className="px-0 sm:px-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Video Link
                    </label>
                    <input
                        type="url"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-sm bg-white dark:bg-gray-800"
                    />
                </div>
                {/* Read Time */}
                <div className="px-0 sm:px-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Read Time
                    </label>
                    <input
                        type="text"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        disabled={loading}
                        placeholder="e.g., 5 min read"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-sm bg-white dark:bg-gray-800"
                    />
                </div>
                {/* Slug Param */}
                <div className="px-0 sm:px-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Slug Param *
                    </label>
                    <input
                        type="text"
                        value={slugParam}
                        onChange={(e) => setSlugParam(e.target.value)}
                        disabled={loading}
                        className={`w-full rounded-md border ${errors.slugParam ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } p-2 text-sm bg-white dark:bg-gray-800`}
                    />
                    {errors.slugParam && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.slugParam}</p>
                    )}
                </div>
                {/* Content Blocks */}
                <div className="space-y-3 sm:space-y-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Content Blocks *
                    </label>
                    {content.map((block, index) => (
                        <div
                            key={block.tempId}
                            className="mb-3 sm:mb-4 p-3 sm:p-4 border rounded-md dark:border-gray-600"
                        >
                            <div className="mb-2">
                                <select
                                    value={block.type}
                                    onChange={(e) => handleContentTypeChange(index, e.target.value)}
                                    disabled={loading}
                                    className={`w-full rounded-md border ${errors[`contentType-${index}`]
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        } p-1.5 sm:p-2 text-sm bg-white dark:bg-gray-800`}
                                >
                                    <option value="">Select Content Type</option>
                                    <option value="heading">Heading</option>
                                    <option value="text">Text</option>
                                    <option value="code">Code</option>
                                    <option value="bold">Bold</option>
                                    <option value="highlight">Highlight</option>
                                </select>
                                {errors[`contentType-${index}`] && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                                        {errors[`contentType-${index}`]}
                                    </p>
                                )}
                            </div>
                            <div className="mb-2">
                                <textarea
                                    value={block.value}
                                    onChange={(e) => handleContentValueChange(index, e.target.value)}
                                    disabled={loading}
                                    rows={3}
                                    placeholder="Enter content..."
                                    className={`w-full rounded-md border ${errors[`contentValue-${index}`]
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        } p-1.5 sm:p-2 text-sm bg-white dark:bg-gray-800`}
                                />
                                {errors[`contentValue-${index}`] && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                                        {errors[`contentValue-${index}`]}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeContentBlock(index)}
                                disabled={loading}
                                className="text-red-500 text-xs sm:text-sm hover:text-red-700"
                            >
                                Remove Block
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addContentBlock}
                        disabled={loading}
                        className="w-full py-1.5 sm:py-2 mt-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 border border-dashed border-gray-300 dark:border-gray-600 rounded-md"
                    >
                        + Add Content Block
                    </button>
                </div>
                {/* Form Actions */}
                <div className="flex justify-end space-x-3 sm:space-x-4 mt-4 sm:mt-6">
                    <button
                        type="submit"
                        disabled={loading || uploadingImage}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 dark:bg-green-400 text-white rounded-lg transition duration-300 text-sm ${loading || uploadingImage
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-green-600 dark:hover:bg-green-500 cursor-pointer'
                            }`}
                    >
                        {loading ? 'Saving...' : 'Save Blog'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlogForm;
