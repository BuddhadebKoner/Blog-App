import axiosInstance from "../../config/config";

// send verify otp
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
      return {
         success: false,
         message: error.response?.data?.message || "Something went wrong"
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
