import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import bookRoute from "./routes/booking.route.js";
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT;

// all my routes are here
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/student", bookRoute);
app.use("/api/v1/admin", adminRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});