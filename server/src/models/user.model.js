import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         trim: true,
         unique: true,
      },
      imageUrl: {
         type: String,
         default: '',
      },
      imageId: {
         type: String,
         default: '',
      },
      password: {
         type: String,
         required: true,
      },
      otp: {
         type: String,
         default: '',
      },
      otpExpires: {
         type: Number,
         default: 0,
      },
      resetOtp: {
         type: String,
         default: '',
      },
      resetOtpExpires: {
         type: Number,
         default: 0,
      },
      isVarified: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

export const UserAuth = mongoose.model('UserAuth', userSchema);