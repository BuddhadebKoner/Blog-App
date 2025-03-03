import express from 'express';
import { createBlog, deleteBlog, getAllBlogsByAuthor, getBlogById, getBlogs, getRecentThreeBlogs, updateBlog } from '../controllers/blog.controller.js';
import { userAuth } from '../middlewares/userAuth.middleware.js';
import fs from 'fs';
import { upload } from '../middlewares/multer.midleware.js';

const blogRoute = express.Router();

blogRoute.post('/create-blog', userAuth, (req, res, next) => {
   try {
      upload.fields([
         { name: "blogImage", maxCount: 1 }
      ])(req, res, (err) => {
         if (err) {
            console.error("Error during file upload:", err);
            fs.appendFileSync("error.log", `Error during file upload: ${err}\n`);
            return res.status(500).send({ error: "File upload failed" });
         }
         next();
      });
   } catch (error) {
      console.error("Unexpected error:", error);
      fs.appendFileSync("error.log", `Unexpected error: ${error}\n`);
      res.status(500).send({ error: "An unexpected error occurred" });
   }
}, createBlog);
blogRoute.put('/update-blog/:slugParam', userAuth, (req, res, next) => {
   try {
      upload.fields([
         { name: "blogImage", maxCount: 1 }
      ])(req, res, (err) => {
         if (err) {
            console.error("Error during file upload:", err);
            fs.appendFileSync("error.log", `Error during file upload: ${err}\n`);
            return res.status(500).send({ error: "File upload failed" });
         }
         next();
      });
   } catch (error) {
      console.error("Unexpected error:", error);
      fs.appendFileSync("error.log", `Unexpected error: ${error}\n`);
      res.status(500).send({ error: "An unexpected error occurred" });
   }
}, updateBlog);

blogRoute.get('/get-all-blogs', getBlogs);
blogRoute.get('/get-blog-by-id/:slugParam', getBlogById);
blogRoute.delete('/delete-blog/:slugParam', userAuth, deleteBlog);
blogRoute.get('/get-all-blogs-by-author/:authorId', getAllBlogsByAuthor);
blogRoute.get('/get-recent-three-blogs', getRecentThreeBlogs);

export default blogRoute;