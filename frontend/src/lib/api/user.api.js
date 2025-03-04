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
