import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      try {
         cb(null, "./public/temp");
      } catch (error) {
         console.error("Error setting destination:", error);
         fs.appendFileSync('error.log', `Error setting destination: ${error}\n`);
         cb(error);
      }
   },
   filename: function (req, file, cb) {
      try {
         cb(null, file.originalname);
      } catch (error) {
         console.error("Error setting filename:", error);
         fs.appendFileSync('error.log', `Error setting filename: ${error}\n`);
         cb(error);
      }
   },
});

const upload = multer({ storage });

export { upload };