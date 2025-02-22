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
// logout
// getUser
// updateUser