import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
   try {
      const { token } = req.cookies;
      
      if (!token) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized access. Please login."
         });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || !decoded.id) {
         return res.status(401).json({
            success: false,
            message: "Invalid token. Please login again."
         });
      }

      // Add userID to request body for controllers to use
      req.body.userID = decoded.id;
      next();
   } catch (error) {
      console.error("JWT verification error:", error);
      
      if (error.name === 'TokenExpiredError') {
         return res.status(401).json({
            success: false,
            message: "Token expired. Please login again."
         });
      } else if (error.name === 'JsonWebTokenError') {
         return res.status(401).json({
            success: false,
            message: "Invalid token. Please login again."
         });
      }
      
      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });
   }
}