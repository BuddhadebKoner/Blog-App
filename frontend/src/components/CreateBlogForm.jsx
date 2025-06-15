import React, { useState, useRef, useEffect } from 'react';
import { createBlog } from '../lib/api/blog.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { uploadImage } from '../lib/api/auth.api';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';

// TipTap Toolbar Component
const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300 dark:border-gray-600 mb-2">
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-2 py-1 rounded text-xs ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-2 py-1 rounded text-xs ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                H3
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded text-xs ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`px-2 py-1 rounded text-xs ${editor.isActive('highlight') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                Highlight
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`px-2 py-1 rounded text-xs ${editor.isActive('codeBlock') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                Code
            </button>
            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`px-2 py-1 rounded text-xs ${editor.isActive('paragraph') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                Text
            </button>
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            >
                Undo
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            >
                Redo
            </button>
        </div>
    );
};

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
    const [editorContent, setEditorContent] = useState('');
    const [editorError, setEditorError] = useState(null);

    const navigate = useNavigate();

    // Initialize TipTap Editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Heading.configure({
                levels: [2, 3],
            }),
            Bold,
            Placeholder.configure({
                placeholder: 'Write your blog content here...',
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            setEditorContent(editor.getHTML());
            // Clear error when user types
            if (editorError) setEditorError(null);
        },
    });

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!slugParam.trim()) newErrors.slugParam = 'Slug is required';

        // Validate editor content
        if (!editorContent.trim()) {
            setEditorError('Blog content is required');
            return false;
        }

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
        setEditorError(null);

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
            const blogData = {
                author: currentUser._id,
                title,
                videoLink,
                readTime,
                slugParam,
                content: editorContent, // Use TipTap editor content
                imageUrl,
                imageId,
            };

            const res = await createBlog(blogData);

            if (res.success) {
                toast.success('Blog created successfully');
                navigate(`/blog/${res.blog.slugParam}`);
                // Reset or clear fields as needed
                setTitle('');
                if (editor) {
                    editor.commands.setContent('');
                }
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
            <div className="space-y-3 sm:space-y-4 overflow-auto">
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
                    {previewImageUrl && (
                        <div className="mt-2">
                            <img
                                src={previewImageUrl}
                                alt="Preview"
                                className="h-32 w-auto object-cover rounded-md"
                            />
                        </div>
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

                {/* TipTap Editor */}
                <div className="px-0 sm:px-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Content *
                    </label>
                    <div className={`border ${editorError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md overflow-hidden bg-white dark:bg-gray-800`}>
                        <MenuBar editor={editor} />
                        <EditorContent
                            editor={editor}
                            className="min-h-[300px] p-3 prose dark:prose-invert max-w-none"
                        />
                    </div>
                    {editorError && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">{editorError}</p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 sm:space-x-4 mt-4 sm:mt-6">
                    <button
                        onClick={handleSubmit}
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
            </div>
        </div>
    );
};

export default CreateBlogForm;