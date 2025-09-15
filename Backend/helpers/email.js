import transporter from "./Transporter.js";
import dotenv from "dotenv"

dotenv.config();

const sendEmailOtp = async (mail, subject, text)=>{
    try {
        await transporter.sendMail({
        from: process.env.PORTAL_EMAIL,
        to: mail,
        subject: subject,
        html: text,
        })

        console.log(`OTP sent to ${mail} via email`)
    } catch (error) {
        console.log(`Error sending OTP to ${mail} via email: ${error}`)
    }
}

export default sendEmailOtp;