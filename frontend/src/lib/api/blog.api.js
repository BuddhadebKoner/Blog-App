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
export const getBlogById = async (id) => {
   try {
      const response = await axiosInstance.get(`/api/blog/get-blog-by-id/${id}`);
      return response.data;
   } catch (error) {
      console.error("Failed to get blog", error);
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong",
      };
   }
};
// delete blog


// get all blogs by user id with pagination
export const getAllBlogsByUserId = async (id, page = 1, limit = 2) => {
   try {
      const response = await axiosInstance.get(
         `/api/blog/get-all-blogs-by-author/${id}?page=${page}&limit=${limit}`
      );
      return response.data;
   } catch (error) {
      console.error("Get Blogs Error:", error);
      throw error;
   }
};

// API call to fetch all blogs with pagination
export const getAllBlogs = async (page = 1, limit = 5) => {
   try {
      const response = await axiosInstance.get(
         `/api/blog/get-all-blogs?page=${page}&limit=${limit}`
      );
      return response.data;
   } catch (error) {
      console.error("Get All Blogs Error:", error);
      throw error;
   }
};

// delete blog by id
export const deleteBlog = async (id) => {
   try {
      const response = await axiosInstance.delete(`/api/blog/delete-blog/${id}`);
      return response.data;
   } catch (error) {
      console.error("Delete Blog Error:", error);
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong",
      };
   }
};