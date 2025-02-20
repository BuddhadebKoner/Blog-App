import Blog from "../models/blogs.model";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

// get all blogs infinite scroll
export const getBlogs = async (req, res) => {
   try {
      const limit = parseInt(req.query.limit) || 5;
      const skip = parseInt(req.query.skip) || 0;

      const blogs = await Blog.find()
         .populate(path = "author", select = "name email")
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 })
         .lean()

      const totalBlogs = await Blog.countDocuments();

      return res.status(200).json({
         success: true,
         message: "Blogs fetched successfully.",
         blogs,
         totalBlogs,
      });
   } catch (error) {
      return res.status(500).json({
         sucess: false,
         message: "Internal Server Error",
      });
   }

};
// get a blog by id
export const getBlogById = async (req, res) => {
   try {
      const { slugParam } = req.params;

      // check if blog exists
      const isExists = await Blog.findOne({ slugParam });
      if (!isExists) {
         return res.status(404).json({
            success: false,
            message: "Blog not found.",
         });
      }

      const blog = await Blog.findOne({
         slugParam
      }).populate(path = "author", select = "name email")
         .lean();

      return res.status(200).json({
         success: true,
         message: "Blog fetched successfully.",
         blog,
      });

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};

// create a blog
export const createBlog = async (req, res) => {
   try {
      const { author, title, videoLink, readTime, slugParam, content } = req.body;
      if (!author || !title || !videoLink || !readTime || !slugParam || !content) {
         return res.status(400).json({
            success: false,
            message: "All fields are required."
         });
      }
      // check slugParam is exists or not
      const isExists = await Blog.findOne({ slugParam });
      if (isExists) {
         return res.status(400).json({
            success: false,
            message: "Slug already exists. Enter a unique slug.",
         });
      }

      const blogImage = req.files?.image?.[0].path;
      if (!blogImage) {
         return res.status(400).json({
            success: false,
            message: "Image is required."
         });
      }
      const image = await uploadOnCloudinary(blogImage);
      if (!image.url) {
         return res.status(400).json({
            success: false,
            message: "Image upload failed."
         });
      }
      const publishedAt = new Date();

      const blog = await Blog.create({
         author,
         title,
         imageId: image.public_id,
         imageUrl: image.url,
         videoLink,
         readTime,
         slugParam,
         publishedAt,
         content
      });

      return res.status(201).json({
         success: true,
         message: "Blog created successfully.",
         blog,
      });

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};
// update a blog
export const updateBlog = async (req, res) => {
   try {
      // check required fields for update
      const { title, videoLink, readTime, willUpdateSlugParams, content } = req.body;

      // slugParam from params
      const { slugParam } = req.params;

      const isBlogExists = await Blog.findOne({ slugParam });
      if (!isBlogExists) {
         return res.status(404).json({
            success: false,
            message: "Blog not found.",
         });
      }

      const blogImage = req.files?.image?.[0].path;
      if (blogImage) {
         const newImage = await uploadOnCloudinary(blogImage);
         // delete past image from cloudinary
         const deleteImage = await deleteFromCloudinary(isBlogExists.imageId);
         if (!deleteImage) {
            console.error("Error deleting image from cloudinary");
         }
         if (!newImage.url) {
            return res.status(400).json({
               success: false,
               message: "Image upload failed."
            });
         }
      }
      const updateBlog = await Blog.findOneAndUpdate
         ({ slugParam }, {
            title,
            imageUrl: newImage.url,
            imageId: newImage.public_id,
            slugParam: willUpdateSlugParams,
            videoLink,
            readTime,
            content
         }, { new: true });

      return res.status(200).json({
         success: true,
         message: "Blog updated successfully.",
         blog: updateBlog,
      });

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};
// delete a Blog
export const deleteBlog = async (req, res) => {
   try {
      const { slugParam } = req.params;

      // check if blog exists using slugParam
      const isBlogExists = await Blog.findOne({ slugParam });
      if (!isBlogExists) {
         return res.status(404).json({
            success: false,
            message: "Blog not found.",
         });
      }

      // delete image from cloudinary
      const deleteImage = await deleteFromCloudinary(isBlogExists.imageId);
      if (!deleteImage) {
         console.error("Error deleting image from cloudinary");
      }

      await Blog.findOneAndDelete({ slugParam });

      return res.status(202).json({
         success: true,
         message: "Blog deleted successfully.",
      });

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};