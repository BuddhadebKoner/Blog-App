import express from 'express'
import { isUserAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVarifyOtp, verifyEmail } from '../controllers/auth.controller.js';
import { userAuth } from '../middlewares/userAuth.middleware.js';
import { getUserById, getUserByIdParams, updateUserById } from '../controllers/user.controller.js';

const authRouter = express.Router();

// auth
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userAuth, logout);
// otp
authRouter.post('/send-verify-otp', userAuth, sendVarifyOtp);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/is-auth', userAuth, isUserAuthenticated)
authRouter.post('/sent-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);
// user data
authRouter.get('/get-user', userAuth, getUserById);
authRouter.put('/update-user', userAuth, updateUserById);
authRouter.get('/get-user/:id', getUserByIdParams);



export default authRouter