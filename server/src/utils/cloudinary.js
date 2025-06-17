import { v2 as cloudinary } from "cloudinary";

// Validate required environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
   console.error('Missing Cloudinary environment variables');
   if (!process.env.VERCEL) {
      process.exit(1);
   }
}

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteFromCloudinary = async (publicId) => {
   try {
      if (!publicId) {
         return null;
      }

      return await cloudinary.uploader.destroy(publicId);
   } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error("Image delete failed");
   }
};