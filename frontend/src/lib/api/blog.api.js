import axiosInstance from "../../config/config";

// create blog
export const createBlog = async (formData) => {
   try {
      const response = await axiosInstance.post('/api/blog/create-blog', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
      return response.data;
   } catch (error) {
      console.error("Failed to create blog", error);
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong",
      };
   }
};

// update blog
// get all blog
// get blog by id
// delete blog