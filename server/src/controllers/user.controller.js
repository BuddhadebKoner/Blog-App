import { UserAuth } from "../models/user.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

// get user data by id
export const getUserById = async (req, res) => {
   try {
      const { userID } = req.body;
      // check user is exist or not
      const user = await UserAuth.findById(userID)
         .select("-password -otp -otpExpires -resetOtp -resetOtpExpires -__v");

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
      const { userID, name } = req.body;
      const userImage = req.files?.userImage?.[0]?.path;
      // console.log(req.body);

      if (!userID) {
         return res.status(401).json({
            message: "Unauthorized Access"
         });
      }
      // check user is exist or not
      const isUserExists = await UserAuth.findById(userID);
      if (!isUserExists) {
         return res.status(404).json({
            message: "User not found"
         });
      }

      // image update handling
      let imageUrl = isUserExists.imageUrl;
      let imageId = isUserExists.imageId;

      // grab image data
      if (userImage) {
         const newImage = await uploadOnCloudinary(userImage);
         if (!newImage.url) {
            return res.status(400).json({
               success: false,
               message: "Image upload failed."
            });
         }

         // delete old image from cloudinary
         if (isUserExists.imageUrl !== "" && isUserExists.imageId !== "") {
            await deleteFromCloudinary(isUserExists.imageId);
         }

         // update with new image details
         imageUrl = newImage.url;
         imageId = newImage.public_id;
      }

      // update user with new data
      const updatedUser = await UserAuth.findOneAndUpdate(
         { _id: userID },
         {
            name,
            imageUrl,
            imageId
         },
         { new: true }
      )

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