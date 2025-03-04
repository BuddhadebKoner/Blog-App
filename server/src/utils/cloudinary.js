import { v2 as cloudinary } from "cloudinary";

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

      const response = await cloudinary.uploader.destroy(publicId);

      return response;
   } catch (error) {
      throw new Error("Image delete failed");
   }
};