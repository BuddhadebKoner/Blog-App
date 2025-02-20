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
      unqiue: true,
   },
   isPublished: {
      type: Boolean,
      default: false,
   },
   publishedAt: {
      type: Date,
      default: null,
   },
   content: [{
      type: { type: String, enum: ["text", "code", "heading", "bold", "highlight"], required: true },
      value: { type: String, required: true },
   }],
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;