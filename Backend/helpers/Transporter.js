import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.PORTAL_EMAIL,
        pass: process.env.PORTAL_PASSWORD,
    },
    priority: "high",
    secure: true
})

export default transporter;