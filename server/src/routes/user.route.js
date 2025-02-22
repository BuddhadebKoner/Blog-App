import express from 'express'
import { isUserAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVarifyOtp, verifyEmail } from '../controllers/auth.controller.js';
import { userAuth } from '../middlewares/userAuth.middleware.js';
import { getUserById, updateUserById } from '../controllers/user.controller.js';
import fs from 'fs';
import { upload } from '../middlewares/multer.midleware.js';

const authRouter = express.Router();

// auth
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userAuth, logout);
// otp
authRouter.post('/send-verify-otp', userAuth, sendVarifyOtp);
authRouter.post('/verify-email', userAuth, verifyEmail);
authRouter.post('/is-auth', userAuth, isUserAuthenticated)
authRouter.post('/sent-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);
// user data
authRouter.get('/get-user', userAuth, getUserById);
authRouter.put('/update-user', userAuth, (req, res, next) => {
   try {
      upload.fields([
         { name: "userImage", maxCount: 1 }
      ])(req, res, (err) => {
         if (err) {
            console.error("Error during file upload:", err);
            fs.appendFileSync("error.log", `Error during file upload: ${err}\n`);
            return res.status(500).send({ error: "File upload failed" });
         }
         next();
      });
   } catch (error) {
      console.error("Unexpected error:", error);
      fs.appendFileSync("error.log", `Unexpected error: ${error}\n`);
      res.status(500).send({ error: "An unexpected error occurred" });
   }
}, updateUserById);




export default authRouter