import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routes/user.route.js"
import blogRoute from "./src/routes/blog.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000
// connect to db
connectDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://192.168.31.100:5173'
].filter(Boolean);

app.use(cors({
   origin: function(origin, callback) {
     if (!origin) return callback(null, true);
     
     if (allowedOrigins.indexOf(origin) !== -1) {
       callback(null, true);
     } else {
       console.log(`Origin ${origin} not allowed by CORS`);
       callback(null, true); 
     }
   },
   credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"]
}));


// testing
app.get('/', (req, res) => {
   res.json({ message: "Hello World" });
})
// auth routes
app.use('/api/auth', authRouter)
// for blogs
app.use('/api/blog', blogRoute);

app.listen(port, () => {
   console.log(`server is running on PORT http://localhost:${port}/`);
   console.log(`Allowed origins for CORS: ${allowedOrigins.join(', ')}`);
});