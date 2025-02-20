import express from 'express';
import { createBlog, deleteBlog, getBlogById, getBlogs, updateBlog } from '../controllers/blog.controller';
import { userAuth } from '../middlewares/userAuth.middleware';
import { upload } from '../middlewares/multer.midleware';
import fs from 'fs';

const blogRoute = express.Router();

blogRoute.get('/get-all-blogs', getBlogs);
blogRoute.get('/get-blog-by-id/:slugParam', getBlogById);
blogRoute.post('/create-blog', userAuth, (req, res, next) => {
   try {
      upload.fields([
         { name: "image", maxCount: 1 }
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
blogRoute.put('/update-blog/:slugParam', userAuth, (req, res) => {
   try {
      upload.fields([
         { name: "image", maxCount: 1 }
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
blogRoute.delete('/delete-blog/:slugParam', userAuth, deleteBlog);

export default blogRoute;