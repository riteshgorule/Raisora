import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();


const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/events", eventRoutes);

//Start the server
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
    dbConnect();
    console.log("Server is running at port " + PORT);
})
