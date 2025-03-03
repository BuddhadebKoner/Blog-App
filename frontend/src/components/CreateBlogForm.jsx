import React, { useState } from 'react'
import { createBlog } from '../lib/api/blog.api'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, House } from 'lucide-react';


const CreateBlogForm = ({
    className,
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
    setImageUrl,
    currentUser,
    setLoading,
    loading
}) => {
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState(null)
    const [blogImageFile, setBlogImageFile] = useState(null);

    const navigate = useNavigate();


    const addContentBlock = () => {
        setContent([...content, { tempId: Date.now().toString(), type: '', value: '' }]);
    };

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

    const handleBlogImageChange = (e) => {
        setErrors({ ...errors, blogImage: null });
        const file = e.target.files[0];
        setBlogImageFile(file);
        setImageUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError(null)

        if (!validateForm()) return

        setLoading(true)

        const formData = new FormData();
        formData.append('author', currentUser._id);
        formData.append('title', title);
        formData.append('videoLink', videoLink);
        formData.append('readTime', readTime);
        formData.append('slugParam', slugParam);

        // Before sending, remove tempId from each content block
        const sanitizedContent = content.map(({ tempId, _id, ...rest }) => rest);
        formData.append('content', JSON.stringify(sanitizedContent));

        if (blogImageFile) {
            formData.append('blogImage', blogImageFile);
        }

        console.log('formData', formData);

        const res = await createBlog(formData);
        if (res.success) {
            // redirect to blog page
            toast.success('Blog created successfully');
            navigate(`/blog/${res.blog.slugParam}`);
            // clean up
            setTitle('');
        } else {
            toast.error(res.message || 'Something went wrong');
        }
        console.log(res);
        setLoading(false)
    }

    return (
        <div className={`${className} px-4 py-[2.5vh] w-full lg:w-1/2 overflow-y-auto h-full`}>
            <div className="w-full flex items-center justify-start mb-6  gap-3">
                <ArrowLeft
                    onClick={() => navigate(-1)}
                    className="w-6 h-6 inline-block mr-2 cursor-pointer" />
                <h1 className='text-2xl font-semibold text-gray-900 dark:text-white text-center'>
                    Create New Blog
                </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-auto">
                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {serverError}
                    </div>
                )}
                {/* Title */}
                <div className='px-1'>
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
                {/* Blog Image */}
                <div className='px-1'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Blog Image
                    </label>
                    <input
                        type="file"
                        onChange={(e) =>
                            handleBlogImageChange(e)
                        }
                        disabled={loading}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800"
                    />
                    {errors.blogImage && <p className="text-red-500 text-sm mt-1">{errors.blogImage}</p>}
                </div>
                {/* Video Link */}
                <div className='px-1'>
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
                <div className='px-1'>
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
                <div className='px-1'>
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
                {/* Content Blocks */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content Blocks *
                    </label>
                    {content.map((block, index) => (
                        <div
                            key={block.tempId}
                            className="mb-4 p-4 border rounded-md dark:border-gray-600"
                        >
                            <div className="mb-2">
                                <select
                                    value={block.type}
                                    onChange={(e) => handleContentTypeChange(index, e.target.value)}
                                    disabled={loading}
                                    className={`w-full rounded-md border ${errors[`contentType-${index}`]
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        } p-2 bg-white dark:bg-gray-800`}
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
                                    onChange={(e) => handleContentValueChange(index, e.target.value)}
                                    disabled={loading}
                                    rows={4}
                                    placeholder="Enter content..."
                                    className={`w-full rounded-md border ${errors[`contentValue-${index}`]
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        } p-2 bg-white dark:bg-gray-800`}
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
                        className={`px-4 py-2 bg-green-500 dark:bg-green-400 text-white rounded-lg transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 dark:hover:bg-green-500 cursor-pointer'
                            }`}
                    >
                        {loading ? 'Saving...' : 'Save Blog'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateBlogForm