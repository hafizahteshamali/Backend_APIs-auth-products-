import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AuthSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true, 
    },
    profile: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

AuthSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

const authModel = mongoose.model("users_data", AuthSchema);
export default authModel;