import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAuth',
   },
   title: {
      type: String,
      required: true,
      trim: true,
   },
   imageUrl: {
      type: String,
      required: true,
   },
   imageId: {
      type: String,
      required: true,
   },
   videoLink: {
      type: String,
      required: true,
   },
   readTime: {
      type: String,
      required: true,
   },
   slugParam: {
      type: String,
      required: true,
      unique: true,
   },
   isPublished: {
      type: Boolean,
      default: false,
   },
   publishedAt: {
      type: Date,
      default: null,
   },
   content: {
      type: String,
      required: true,
      trim: true,
   },
   contentType: {
      type: String,
      enum: ['markdown', 'html'],
      default: 'markdown',
   },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;