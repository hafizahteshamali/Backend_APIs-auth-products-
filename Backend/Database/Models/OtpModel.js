import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        required: true,
        index: {expires: 0}
    },
    purpose: {
        type: String,
        enum: ["signup", "forgot_password"],
        required: true
    }
}, {timestamps: true})

const otpModel = mongoose.model("otp", otpSchema);
export default otpModel;