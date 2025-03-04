import express from 'express';
import { createBlog, deleteBlog, getAllBlogsByAuthor, getBlogById, getBlogs, getRecentThreeBlogs, updateBlog } from '../controllers/blog.controller.js';
import { userAuth } from '../middlewares/userAuth.middleware.js';

const blogRoute = express.Router();

blogRoute.post('/create-blog', userAuth, createBlog);
blogRoute.put('/update-blog/:slugParam', userAuth, updateBlog);

blogRoute.get('/get-all-blogs', getBlogs);
blogRoute.get('/get-blog-by-id/:slugParam', getBlogById);
blogRoute.delete('/delete-blog/:slugParam', userAuth, deleteBlog);
blogRoute.get('/get-all-blogs-by-author/:authorId', getAllBlogsByAuthor);
blogRoute.get('/get-recent-three-blogs', getRecentThreeBlogs);

export default blogRoute;