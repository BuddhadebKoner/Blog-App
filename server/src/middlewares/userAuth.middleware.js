import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
   const { token } = req.cookies;
   if (!token) {
      return res.status(401).json({
         success: false,
         message: "Unauthorized access."
      });
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized access."
         });
      }

      if (decoded.id) {
         req.body.userID = decoded.id;
         next();
      } else {
         return res.status(401).json({
            success: false,
            message: "Unauthorized access."
         });
      }
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });
   }
}