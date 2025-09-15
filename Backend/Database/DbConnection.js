import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const DbConnection = async()=>{
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("Database connected successfully...");
    } catch (error) {
        console.log("Database not connected...", error)
    }
}

export default DbConnection;