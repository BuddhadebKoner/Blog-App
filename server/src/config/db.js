import mongoose from "mongoose";

const connectDB = async () => {
   try {
      // Check if we already have a connection
      if (mongoose.connections[0].readyState) {
         return mongoose.connections[0];
      }

      // Validate required environment variable
      if (!process.env.MONGODB_URI) {
         throw new Error('MONGODB_URI environment variable is not defined');
      }

      const connectionInstance = await mongoose.connect(
         process.env.MONGODB_URI,
         {
            bufferCommands: false,
         }
      );
      
      console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
      return connectionInstance;
   } catch (error) {
      console.error("MongoDB connection Error:", error);
      // Don't exit process in serverless environment
      if (process.env.VERCEL) {
         throw error;
      }
      process.exit(1);
   }
};

export default connectDB;