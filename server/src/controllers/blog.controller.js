import Blog from "../models/blogs.model.js";
import { UserAuth } from "../models/user.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// get all blogs infinite scroll
export const getBlogs = async (req, res) => {
   try {
      let { page, limit } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 5;

      if (page < 1 || limit < 1) {
         return res.status(400).json({
            success: false,
            message: "Invalid pagination parameters.",
         });
      }

      const skip = (page - 1) * limit;

      // Fetch blogs with pagination and author details
      const blogs = await Blog.find()
         .populate({ path: "author", select: "name email" })
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 })
         .lean();

      const totalBlogs = await Blog.countDocuments();

      return res.status(200).json({
         success: true,
         message: "Blogs fetched successfully.",
         blogs,
         totalBlogs,
         totalPages: Math.ceil(totalBlogs / limit),
         currentPage: page,
      });
   } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({
         success: false,
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

      const blog = await Blog.findOne({ slugParam })
         .populate({ path: "author", select: "-password -otp -otpExpires -resetOtp -resetOtpExpires -blogs -__v" })
         .sort({ createdAt: -1 })
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

// create blog
export const createBlog = async (req, res) => {
   try {
      const { author, title, videoLink, readTime, slugParam: originalSlugParam, content } = req.body;
      const blogImage = req.files?.blogImage?.[0]?.path;

      if (!author || !title || !videoLink || !readTime || !originalSlugParam || !content) {
         fs.unlinkSync(blogImage);
         return res.status(400).json({
            success: false,
            message: "All fields are required."
         });
      }

      // remove space add hyphen and convert to lowercase
      const slugParam = originalSlugParam.replace(/\s+/g, "-").toLowerCase();

      // Convert content string to an array
      let parsedContent;
      try {
         parsedContent = JSON.parse(content);
         if (!Array.isArray(parsedContent) || parsedContent.some(item => !item.type || !item.value)) {
            fs.unlinkSync(blogImage);
            return res.status(400).json({
               success: false,
               message: "Invalid content format."
            });
         }
      } catch (err) {
         fs.unlinkSync(blogImage);
         return res.status(400).json({
            success: false,
            message: "Content must be a valid JSON array."
         });
      }

      // Check if slug exists
      const isExists = await Blog.findOne({ slugParam });
      if (isExists) {
         fs.unlinkSync(blogImage);
         return res.status(400).json({
            success: false,
            message: "Slug already exists. Enter a unique slug.",
         });
      }

      // Check if author exists
      const isUserExists = await UserAuth.findById(author);
      if (!isUserExists) {
         fs.unlinkSync(blogImage);
         return res.status(404).json({
            success: false,
            message: "Author not found.",
         });
      }

      // Validate and process image
      if (!blogImage) {
         fs.unlinkSync(blogImage);
         return res.status(400).json({
            success: false,
            message: "Image is required."
         });
      }

      const image = await uploadOnCloudinary(blogImage);
      if (!image.url) {
         fs.unlinkSync(blogImage);
         return res.status(400).json({
            success: false,
            message: "Image upload failed."
         });
      }

      const publishedAt = new Date();
      const newBlog = await Blog.create({
         author,
         title,
         imageUrl: image.url,
         imageId: image.public_id,
         videoLink,
         readTime,
         slugParam,
         content: parsedContent,
         isPublished: true,
         publishedAt
      });

      if (!newBlog) {
         fs.unlinkSync(blogImage);
         return res.status(500).json({
            success: false,
            message: "Blog creation failed."
         });
      }

      // update user with blog id
      const userUpdateResult = await UserAuth.findByIdAndUpdate(author, { $push: { blogs: newBlog._id } });
      // console.log(userUpdateResult);

      return res.status(201).json({
         success: true,
         message: "Blog created successfully.",
         blog: newBlog,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};

// update a blog
export const updateBlog = async (req, res) => {
   try {
      const { title, videoLink, readTime, willUpdateSlugParams, content } = req.body;
      const { slugParam } = req.params;
      const blogImage = req.files?.blogImage?.[0]?.path;

      // if all fields are empty then return 
      if (!title && !videoLink && !readTime && !willUpdateSlugParams && !content && !blogImage) {
         fs.unlinkSync(blogImage);
         return res.status(400).json({
            success: false,
            message: "At least one field is required to update."
         });
      }


      // Check if the blog exists
      const isBlogExists = await Blog.findOne({ slugParam });
      if (!isBlogExists) {
         fs.unlinkSync(blogImage);
         return res.status(404).json({
            success: false,
            message: "Blog not found.",
         });
      }

      // Parse content if it's sent as a string
      let parsedContent;
      if (content) {
         try {
            parsedContent = JSON.parse(content);
            if (!Array.isArray(parsedContent) || parsedContent.some(item => !item.type || !item.value)) {
               return res.status(400).json({
                  success: false,
                  message: "Invalid content format."
               });
            }
         } catch (err) {
            return res.status(400).json({
               success: false,
               message: "Content must be a valid JSON array."
            });
         }
      }

      // Image update handling
      let imageUrl = isBlogExists.imageUrl;
      let imageId = isBlogExists.imageId;

      if (blogImage) {
         const newImage = await uploadOnCloudinary(blogImage);
         if (!newImage.url) {
            fs.unlinkSync(blogImage);
            return res.status(400).json({
               success: false,
               message: "Image upload failed."
            });
         }

         // Delete the old image from Cloudinary
         await deleteFromCloudinary(isBlogExists.imageId);

         // Update with new image details
         imageUrl = newImage.url;
         imageId = newImage.public_id;
      }

      // Update the blog with new data
      const updatedBlog = await Blog.findOneAndUpdate(
         { slugParam },
         {
            title,
            imageUrl,
            imageId,
            slugParam: willUpdateSlugParams || slugParam,
            videoLink,
            readTime,
            content: parsedContent || isBlogExists.content,
         },
         { new: true }
      );

      fs.unlinkSync(blogImage);
      return res.status(200).json({
         success: true,
         message: "Blog updated successfully.",
         blog: updatedBlog,
      });

   } catch (error) {
      console.error(error);
      fs.unlinkSync(blogImage);
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

// get all blogs by author, with infinity scroll
export const getAllBlogsByAuthor = async (req, res) => {
   try {
      const { authorId } = req.params;
      let { page, limit } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 5;

      if (page < 1 || limit < 1) {
         return res.status(400).json({
            success: false,
            message: "Invalid pagination parameters.",
         });
      }

      const skip = (page - 1) * limit;

      // Fetch blogs with pagination and author details
      const blogs = await Blog.find({ author: authorId })
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 })
         .select("title imageUrl readTime slugParam publishedAt")
         .lean();

      const totalBlogs = await Blog.countDocuments({ author: authorId });

      return res.status(200).json({
         success: true,
         message: "Blogs fetched successfully.",
         blogs,
         totalBlogs,
         totalPages: Math.ceil(totalBlogs / limit),
         currentPage: page,
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });

   }
};