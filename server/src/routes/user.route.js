import express from 'express';
import { getUserById, updateUserById } from '../controllers/user.controller.js';
import { userAuth } from '../middlewares/userAuth.middleware.js';
import { upload } from '../middlewares/multer.midleware.js';
import fs from 'fs';


const userRouter = express.Router();

userRouter.get('/get-user', userAuth, getUserById);
userRouter.put('/update-user', userAuth, (req, res, next) => {
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

export default userRouter;