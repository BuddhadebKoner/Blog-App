import express from 'express'
import { isUserAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVarifyOtp, verifyEmail } from '../controllers/auth.controller.js';
import { userAuth } from '../middlewares/userAuth.middleware.js';

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



export default authRouter