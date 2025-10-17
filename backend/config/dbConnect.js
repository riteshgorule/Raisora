import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected: ${connect.connection.host}, ${connect.connection.name}`);
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`);
        // Don't exit process for now, just log the error
        console.log("Continuing without database connection...");
    }
};

export default dbConnect;