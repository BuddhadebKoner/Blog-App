import { UserAuth } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({
            success: false,
            message: "Required field can't be empty!"
         });
      }

      const existUser = await UserAuth.findOne({ email });

      if (existUser) {
         return res.status(400).json({
            success: false,
            message: "Email already exists. Try another email!"
         });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserAuth.create({
         name,
         email,
         password: hashedPassword
      });

      if (!newUser) {
         return res.status(500).json({
            success: false,
            message: "User not created properly, please retry."
         });
      }

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.CURRENT_STATUS === 'production',
         sameSite: process.env.CURRENT_STATUS === 'production' ? 'none' : 'strict',
         maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // semdimg email
      const mailOptions = {
         from: process.env.SENDER_EMAIL,
         to: email,
         subject: "Test Email",
         text: "This is a test email from Nodemailer."
      };

      await transporter.sendMail(mailOptions);

      return res.status(201).json({
         success: true,
         message: "User created successfully",
         data: newUser
      });
   } catch (error) {
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
      // check required fields
      if (!userID || !otp) {
         return res.status(400).json({
            success: false,
            message: "User ID and OTP are required."
         });
      }
      // check user
      const user = await UserAuth.findById(userID);
      if (!user) {
         return res.status(400).json({
            success: false,
            message: "User not found."
         });
      }
      // check otp
      if (user.otp === '' || user.otp !== otp) {
         return res.status(400).json({
            success: false,
            message: "Invalid OTP."
         });
      }
      // check otp expires
      if (user.otpExpires < Date.now()) {
         return res.status(400).json({
            success: false,
            message: "OTP expired. Try again."
         });
      }

      // update user
      user.isVarified = true;
      user.otp = '';
      user.otpExpires = '';
      await user.save();


      return res.status(200).json({
         success: true,
         message: "Email verified successfully."
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });
   }
};

export const isUserAuthenticated = async (req, res) => {
   try {
      return res.status(200).json({
         success: true,
         message: "User is authenticated."
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