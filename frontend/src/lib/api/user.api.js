import axiosInstance from "../../config/config";

// Register
export const register = async (data) => {
   const { name, email, password } = data;

   if (!name || !email || !password) {
      return {
         success: false,
         message: "Required field can't be empty!"
      };
   }

   try {
      const response = await axiosInstance.post('/api/auth/register', {
         name,
         email,
         password,
      });

      // console.log("Register Response:", response.data);

      return response.data;
   } catch (error) {
      console.error("Register Error:", error);
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong"
      };
   }
};

// login
export const login = async (data) => {
   const { email, password } = data;

   if (!email || !password) {
      return {
         success: false,
         message: "Required field can't be empty!"
      };
   }

   try {
      const response = await axiosInstance.post('/api/auth/login', {
         email,
         password,
      });

      return response.data;
   } catch (error) {
      console.error("Login Error:", error);
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong"
      };
   }
};

// logout
export const logOut = async () => {
   try {
      const response = await axiosInstance.post('/api/auth/logout');
      return response.data;
   } catch (error) {
      console.error("Logout Error:", error);
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong"
      };
   }
};
// getUser
export const getUser = async () => {
   try {
      const response = await axiosInstance.get(`/api/auth/get-user`);
      return response.data;
   } catch (error) {
      console.error("Get User Error:", error);
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong"
      };
   }
};
// get user by id params
export const getUserById = async (id) => {
   try {
      const response = await axiosInstance.get(`/api/auth/get-user/${id}`);
      return response.data;
   } catch (error) {
      console.error("Get User Error:", error);
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong"
      };
   }
}

// update user
export const updateUser = async (userData) => {
   try {
      const response = await axiosInstance.put('/api/auth/update-user', userData);
      return response.data;
   } catch (error) {
      console.error("Update User Error:", error);
      throw error;
   }
};

// Upload image to Cloudinary
export const uploadImage = async (file) => {
  try {
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER;
    
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Missing Cloudinary configuration');
    }

    // Create a FormData instance for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER || 'mern-blog/profiles');

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
