import { UserAuth } from "../models/user.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

// get user data by id
export const getUserById = async (req, res) => {
   try {
      const { userID } = req.body;
      // check user is exist or not
      const user = await UserAuth.findById(userID)
         .select("-password -otp -otpExpires -resetOtp -resetOtpExpires -__v -blogs");

      if (!user) {
         return res.status(404).json({
            message: "User not found"
         });
      }

      return res.status(200).json({
         message: "User data fetched successfully",
         user
      });
   } catch (error) {
      return res.status(500).json({
         message: "Internal server error"
      });
   }
};

// update user data by id
export const updateUserById = async (req, res) => {
   try {
      const { userID, name, imageUrl, imageId } = req.body;

      // User validation
      if (!userID) {
         return res.status(401).json({
            message: "Unauthorized Access"
         });
      }

      // Check if user exists
      const isUserExists = await UserAuth.findById(userID);
      if (!isUserExists) {
         return res.status(404).json({
            message: "User not found"
         });
      }

      // delete previous image from cloudinary
      if (isUserExists.imageId) { 
         await deleteFromCloudinary(isUserExists.imageId);
      };

      const updatedUser = await UserAuth.findOneAndUpdate(
         { _id: userID },
         {
            name,
            imageUrl: imageUrl || isUserExists.imageUrl,
            imageId: imageId || isUserExists.imageId
         },
         { new: true }
      );

      if (!updatedUser) {
         return res.status(400).json({
            message: "User update failed"
         });
      }

      return res.status(200).json({
         message: "User updated successfully",
         user: updatedUser
      });
   } catch (error) {
      return res.status(500).json({
         message: "Internal server error"
      });
   }
};

// getUserByIdParams
export const getUserByIdParams = async (req, res) => {
   try {
      const { id } = req.params;
      // check user is exist or not
      const user = await UserAuth.findById(id)
         .select("-password -otp -otpExpires -resetOtp -resetOtpExpires -__v -blogs");
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found"
         });
      }

      return res.status(200).json({
         success: true,
         message: "User data fetched successfully",
         user
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal server error"
      });
   }
};