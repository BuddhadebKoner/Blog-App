import axiosInstance from "../../config/config";

// create blog
export const createBlog = async (formData) => {
   const { author, title, videoLink, readTime, slugParam, content, blogImage, } = formData;
   if (!author || !title || !videoLink || !readTime || !slugParam || !content || !blogImage) {
      return {
         success: false,
         message: "Required field can't be empty!"
      };
   }

   try {
      const response = await axiosInstance.post('/api/blog/create-blog', formData);

      if (!response.data.success) {
         return {
            success: false,
            message: response.data.message || "Something went wrong"
         };
      }

      return response.data;

   } catch (error) {
      console.error("Faild to create blog", error);
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong"
      };
   }
}
// update blog
// get all blog
// get blog by id
// delete blog