import { UserAuth } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();


// Register User & Send OTP
export const register = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({
            success: false,
            message: "Required fields can't be empty!"
         });
      }

      const existUser = await UserAuth.findOne({ email });
      if (existUser) {
         // If the account exists but isn't verified, re-issue the OTP
         if (!existUser.isVarified) {
            const otp = String(Math.floor(100000 + Math.random() * 900000));
            existUser.otp = otp;
            existUser.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

            // Optionally: update other fields (like name or password) if needed here
            await existUser.save();

            // Send OTP via email
            const mailOptions = {
               from: process.env.SENDER_EMAIL,
               to: email,
               subject: "Verify Your Account",
               text: `Your OTP is ${otp}`
            };
            await transporter.sendMail(mailOptions);

            return res.status(200).json({
               success: true,
               message: "An unverified account already exists. A new OTP has been sent to your email.",
               data: {
                  userID: existUser._id,
                  email: existUser.email
               }
            });
         } else {
            // If the account is already verified, don't allow duplicate registrations
            return res.status(400).json({
               success: false,
               message: "Email already exists. Please login.",
               data: {
                  userID: existUser._id,
                  email: existUser.email
               }
            });
         }
      }

      // If no existing account, create a new user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const otp = String(Math.floor(100000 + Math.random() * 900000));

      const newUser = await UserAuth.create({
         name,
         email,
         password: hashedPassword,
         otp,
         otpExpires: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
         isVerified: false
      });

      if (!newUser) {
         return res.status(500).json({
            success: false,
            message: "User not created properly, please retry."
         });
      }

      // Send OTP via email
      const mailOptions = {
         from: process.env.SENDER_EMAIL,
         to: email,
         subject: "Verify Your Account",
         text: `Your OTP is ${otp}`
      };
      await transporter.sendMail(mailOptions);

      return res.status(201).json({
         success: true,
         message: "OTP sent for verification. Please check your email.",
         data: {
            userID: newUser._id,
            email: newUser.email
         }
      });
   } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });
   }
};

export const login = async (req, res) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email and password are required for login."
         });
      }

      const userLogin = await UserAuth.findOne({ email });
      if (!userLogin) {
         return res.status(400).json({
            success: false,
            message: "Incorrect email."
         });
      }
      if (!userLogin.isVarified) {
         return res.status(400).json({
            success: false,
            message: "Unauthorized Activity. Create account using otp"
         });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, userLogin.password);
      if (!isMatch) {
         return res.status(400).json({
            success: false,
            message: "Incorrect password."
         });
      }

      // generate token
      const token = jwt.sign({ id: userLogin._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.CURRENT_STATUS === 'production',
         sameSite: process.env.CURRENT_STATUS === 'production' ? 'none' : 'strict',
         maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.status(200).json({
         success: true,
         message: "User logged in successfully."
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });
   }
};

export const logout = async (req, res) => {
   try {
      res.clearCookie("token", {
         httpOnly: true,
         secure: process.env.CURRENT_STATUS === "production",
         sameSite: process.env.CURRENT_STATUS === "production" ? "none" : "strict",
         path: "/",
      });

      return res.status(200).json({
         success: true,
         message: "User logged out successfully."
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });
   }
};

export const sendVarifyOtp = async (req, res) => {
   try {
      const { userID } = req.body;
      if (!userID) {
         return res.status(400).json({
            success: false,
            message: "User ID is required."
         });
      }

      const user = await UserAuth.findById(userID);
      if (!user) {
         return res.status(400).json({
            success: false,
            message: "User not found."
         });
      }
      if (user.isVarified) {
         return res.status(400).json({
            success: false,
            message: "User is already verified."
         });
      }

      // generate otp
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.otp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
      await user.save();

      // send email
      const mailOptions = {
         from: process.env.SENDER_EMAIL,
         to: user.email,
         subject: "Verify OTP",
         text: `Your OTP is ${otp}`
      };
      await transporter.sendMail(mailOptions);

      return res.status(200).json({
         success: true,
         message: "OTP sent successfully."
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });
   }
};

export const verifyEmail = async (req, res) => {
   try {
      const { userID, otp } = req.body;

      // Validate input
      if (!userID || !otp) {
         return res.status(400).json({ success: false, message: "User ID and OTP are required." });
      }

      if (!mongoose.Types.ObjectId.isValid(userID)) {
         return res.status(400).json({ success: false, message: "Invalid User ID format." });
      }

      // Check if user exists
      const user = await UserAuth.findById(userID).select("+otp +otpExpires");
      if (!user) {
         return res.status(404).json({ success: false, message: "User not found." });
      }

      // Validate OTP
      if (!user.otp || user.otp !== otp) {
         await user.save();
         return res.status(400).json({ success: false, message: "Invalid OTP." });
      }

      // Check OTP expiration
      if (user.otpExpires < Date.now()) {
         return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
      }

      // Update user verification status
      user.isVarified = true;
      user.otp = '';
      user.otpExpires = '';
      await user.save();

      // Generate secure JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRE || "7d",
      });

      // Set secure HTTP-only cookie
      res.cookie("token", token, {
         httpOnly: true,
         secure: process.env.CURRENT_STATUS === "production",
         sameSite: process.env.CURRENT_STATUS === "production" ? "none" : "strict",
         maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
         success: true,
         message: "Email verified successfully.",
         data: {
            userID: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            imageId: user.imageId,
            isVarified: user.isVarified,
            createdAt: user.createdAt,
         },
      });
   } catch (error) {
      console.error("Error verifying email:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};

export const isUserAuthenticated = async (req, res) => {
   try {

      const { userID } = req.body;

      if (!userID) {
         return res.status(400).json({
            success: false,
            message: "User ID is required."
         });
      }

      const user = await UserAuth.findById(userID)
         .select("-password -otp -otpExpires -resetOtp -resetOtpExpires -blogs");

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "User not found."
         });
      };

      return res.status(200).json({
         success: true,
         message: "User is authenticated.",
         data: user
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });
   }
};

// send pass reset otp
export const sendResetOtp = async (req, res) => {
   try {
      const { email } = req.body;
      if (!email) {
         return res.status(400).json({
            success: false,
            message: "Email is required."
         });
      }
      const user = await UserAuth.findOne({ email });
      if (!user) {
         return res.status(400).json({
            success: false,
            message: "User not found."
         });
      }
      // generate otp
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.resetOtp = otp;
      user.resetOtpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
      await user.save();

      // send email
      const mailOptions = {
         from: process.env.SENDER_EMAIL,
         to: user.email,
         subject: "Password Reset Otp",
         text: `Your OTP is ${otp}`
      };
      await transporter.sendMail(mailOptions);

      return res.status(200).json({
         success: true,
         message: "Password Rest OTP sent successfully."
      });

   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });
   }
};

// Reset User Password
export const resetPassword = async (req, res) => {
   try {
      const { email, otp, newPassword } = req.body;
      // check required fields
      if (!email || !otp || !newPassword) {
         return res.status(400).json({
            success: false,
            message: "Email, OTP and New Password are required."
         });
      }
      // check user
      const user = await UserAuth.findOne({ email });
      if (!user) {
         return res.status(400).json({
            success: false,
            message: "User not found."
         });
      }
      // check otp
      if (user.resetOtp === '' || user.resetOtp !== otp) {
         return res.status(400).json({
            success: false,
            message: "Invalid OTP."
         });
      }
      // check otp expires
      if (user.resetOtpExpires < Date.now()) {
         return res.status(400).json({
            success: false,
            message: "OTP expired. Try again."
         });
      }
      // update password
      const hasPassword = await bcrypt.hash(newPassword, 10);
      user.password = hasPassword;
      user.resetOtp = '';
      user.resetOtpExpires = '';
      await user.save();

      return res.status(200).json({
         success: true,
         message: "Password has reset successfully."
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });

   }
};