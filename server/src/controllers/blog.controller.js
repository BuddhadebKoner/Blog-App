import Blog from "../models/blogs.model.js";
import { UserAuth } from "../models/user.model.js";

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
         .select("imageUrl title publishedAt createdAt readTime slugParam")
         .populate({ path: "author", select: "name imageUrl" })
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
      const {
         author,
         title,
         videoLink,
         readTime,
         slugParam: originalSlugParam,
         content,
         imageUrl,
         imageId
      } = req.body;

      console.log("req.body", req.body);

      // Check if all required fields are present
      if (!author || !title || !videoLink || !readTime || !originalSlugParam || !content || !imageUrl || !imageId) {
         return res.status(400).json({
            success: false,
            message: "All fields are required."
         });
      }

      // Process slugParam - remove spaces, convert to lowercase, remove special characters
      const slugParam = originalSlugParam
         .replace(/\s+/g, "-")
         .toLowerCase()
         .replace(/[^a-zA-Z0-9-]/g, "");

      // Validate slugParam is not empty after processing
      if (!slugParam) {
         return res.status(400).json({
            success: false,
            message: "Invalid slug. Please provide a slug that contains alphanumeric characters."
         });
      }

      // Parse and validate content
      let parsedContent;
      try {
         parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
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

      // Check if slug exists
      const isExists = await Blog.findOne({ slugParam });
      if (isExists) {
         return res.status(400).json({
            success: false,
            message: "Slug already exists. Enter a unique slug.",
         });
      }

      // Check if author exists
      const isUserExists = await UserAuth.findById(author);
      if (!isUserExists) {
         return res.status(404).json({
            success: false,
            message: "Author not found.",
         });
      }

      const publishedAt = new Date();

      // Create the blog with explicit field names matching the schema
      const newBlog = new Blog({
         author,
         title,
         imageUrl,
         imageId,
         videoLink,
         readTime,
         slugParam,
         content: parsedContent,
         isPublished: true,
         publishedAt
      });

      // Save the blog
      await newBlog.save();

      return res.status(201).json({
         success: true,
         message: "Blog created successfully.",
         blog: newBlog,
      });
   } catch (error) {
      console.error("Full error:", error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error: " + error.message,
         code: error.code
      });
   }
};

// update a blog
export const updateBlog = async (req, res) => {
   try {
      const { title, videoLink, readTime, willUpdateSlugParams, content, imageUrl, imageId } = req.body;
      const { slugParam } = req.params;

      // If all fields are empty then return
      if (!title && !videoLink && !readTime && !willUpdateSlugParams && !content && !imageUrl && !imageId) {
         return res.status(400).json({
            success: false,
            message: "At least one field is required to update."
         });
      }

      // Check if the blog exists
      const isBlogExists = await Blog.findOne({ slugParam });
      if (!isBlogExists) {
         return res.status(404).json({
            success: false,
            message: "Blog not found.",
         });
      }

      // Parse content if it's sent as a string
      let parsedContent;
      if (content) {
         try {
            parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
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

      // Update the blog with new data
      const updatedBlog = await Blog.findOneAndUpdate(
         { slugParam },
         {
            title: title || isBlogExists.title,
            imageUrl: imageUrl || isBlogExists.imageUrl,
            imageId: imageId || isBlogExists.imageId,
            slugParam: willUpdateSlugParams || slugParam,
            videoLink: videoLink || isBlogExists.videoLink,
            readTime: readTime || isBlogExists.readTime,
            content: parsedContent || isBlogExists.content,
         },
         { new: true }
      );

      return res.status(200).json({
         success: true,
         message: "Blog updated successfully.",
         blog: updatedBlog,
      });
   } catch (error) {
      console.error(error);
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

// return most resent 3 blogs
export const getRecentThreeBlogs = async (req, res) => {
   try {
      const recentBlogs = await Blog.find()
         .select("title imageUrl readTime slugParam publishedAt")
         .populate({ path: "author", select: "name imageUrl" })
         .sort({ createdAt: -1 })
         .limit(3)
         .lean();

      return res.status(200).json({
         success: true,
         message: "Recent blogs fetched successfully.",
         recentBlogs,
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};