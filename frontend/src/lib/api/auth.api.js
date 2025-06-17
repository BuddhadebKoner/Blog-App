import axiosInstance from "../../config/config";

// send verify otp
export const sendVerifyOtp = async ({ userID }) => {
   if (!userID) {
      throw new Error("User ID is required!");
   }

   try {
      const response = await axiosInstance.post("/api/auth/send-verify-otp", { userID });
      return response.data;
   } catch (error) {
      throw new Error(error.response?.data?.message || "Something went wrong");
   }
};

// verify email
export const varifyEmail = async ({ userID, otp }) => {
   if (!userID || !otp) {
      throw new Error("Required field can't be empty!");
   }

   try {
      const response = await axiosInstance.post("/api/auth/verify-email", { userID, otp });
      return response.data;
   } catch (error) {
      throw new Error(error.response?.data?.message || "Something went wrong");
   }
};
export const isAuthenticated = async () => {
   try {
      const response = await axiosInstance.post('/api/auth/is-auth');
      return response.data;
   } catch (error) {
      console.error("Is Authenticated Error:", error);

      // Important: For network errors, don't return an object, throw the error
      // so it can be caught by the useQuery error handler
      if (error.code === "ERR_NETWORK" ||
         error.message === "Network Error" ||
         (error.name === "AxiosError" && error.message === "Network Error")) {
         throw error;
      }

      // For authentication errors (401), return unsuccessful response
      if (error.response?.status === 401) {
         return {
            success: false,
            message: error.response?.data?.message || "Not authenticated"
         };
      }

      // For other errors (like 500, etc.), return a formatted response
      return {
         success: false,
         message: error.response?.data?.message || "Authentication failed"
      };
   }
};
// send reset otp
export const sendResetOtp = async ({ email }) => {
   if (!email) {
      throw new Error("Required field can't be empty!");
   }

   try {
      const response = await axiosInstance.post("/api/auth/sent-reset-otp", { email });
      return response.data;
   } catch (error) {
      throw new Error(error.response?.data?.message || "Something went wrong");
   }
};
// reset password
export const resetPassword = async ({ email, otp, newPassword }) => {
   if (!email || !otp || !newPassword) {
      throw new Error("Required field can't be empty!");
   }

   try {
      const response = await axiosInstance.post("/api/auth/reset-password", { email, otp, newPassword });
      return response.data;
   } catch (error) {
      throw new Error(error.response?.data?.message || "Something went wrong");
   }
};


// Upload image to Cloudinary
export const uploadImage = async (file, path) => {
   try {
      const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
         throw new Error('Missing Cloudinary configuration');
      }

      // Create a FormData instance for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', path || 'mern-blog');

      // Direct upload to Cloudinary using fetch API
      const response = await fetch(
         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
         {
            method: 'POST',
            body: formData,
         }
      );

      if (!response.ok) {
         throw new Error('Image upload to Cloudinary failed');
      }

      const data = await response.json();
      return {
         success: true,
         imageUrl: data.secure_url,
         imageId: data.public_id
      };
   } catch (error) {
      console.error("Cloudinary upload error:", error);
      return {
         success: false,
         message: error.message || "Failed to upload image"
      };
   }
};
