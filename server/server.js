import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routes/user.route.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000
// connect to db
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// testing
app.get('/', (req, res) => {
   res.json({ message: "Hello World" });
})
// auth routes
app.use('/api/auth', authRouter)

app.listen(port, () => {
   console.log(`server is running on PORT http://localhost:${port}/`);
});