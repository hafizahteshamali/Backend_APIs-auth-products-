import authModel from "../Database/Models/AuthModel.js";
import crypto from "crypto";
import otpModel from "../Database/Models/OtpModel.js";
import sendEmailOtp from "../helpers/email.js";
import otpTemplate from "../helpers/otpTemplate.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SignupController = async (req, res)=>{
    try {
        const {name, email, password} = req.body;
        const file = req.file?.path;

        if(!name || !email || !password || !file){
            return res.status(400).send({message: "all fields are required..."});
        }

        const existUser = await authModel.findOne({email});

        if(existUser){
            return res.status(409).send({message: "user already exist..."});
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expireOtp = Date.now() + 10 * 60 *1000;

        await otpModel.create({
            email: email,
            otp: otp,
            expireAt: expireOtp,
            purpose: "signup"
        })

        await sendEmailOtp(
            email, 
            "Verify your email with OTP",
            otpTemplate(name, otp)
        )

        const newUser = await authModel.create({
            name: name,
            email: email,
            password: password,
            profile: file
        })

        return res.status(201).send({message: "Signup Successfully, OTP sent to email.", user: {name: newUser.name, email: newUser.email, profile: newUser.profile}, isVerified: newUser.isVerified})

    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const OtpForSignup = async (req, res)=>{
    try {
        const {email, otp, purpose} = req.body;

        if(!email || !otp || !purpose){
            return res.status(400).send({message: "all fields are required..."});
        }

        const userRecord = await otpModel.findOne({email})

        if(!userRecord){
            return res.status(409).send({message: "No Record found"})
        }

        if(userRecord.purpose !== purpose || userRecord.otp !== otp){
            return res.status(404).send({message: "invalid purpose or otp"})
        }

        if(userRecord.expireAt < Date.now()){
            await otpModel.deleteOne({_id: userRecord._id});
            return res.status(410).send({ message: "OTP expired, please request again" });
        }

        const user = await authModel.findOneAndUpdate(
            {email},
            {isVerified: true},
            {new: true}
        )

        if(!user){
            return res.status(404).send({message: "User not found."})
        }

        await otpModel.deleteOne({_id: userRecord._id})

        return res.status(200).send({
            message: "OTP verified successfully.",
            user: {
              name: user.name,
              email: user.email,
              isVerified: user.isVerified,
            },
          });

    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const LoginController = async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).send({message: "all fields are required..."});
        }

        const foundUser = await authModel.findOne({email});

        if(!foundUser){
            return res.status(404).send({message: "user not found..."});
        }

        const checkCred = await bcrypt.compare(password, foundUser.password);

        if(!checkCred){
            return res.status(401).send({message: "invalid credintials"});
        }

        if(!foundUser.isVerified){
            return res.status(403).send({ message: "Please verify your email before login." });
        }

        const token = jwt.sign(
            {id: foundUser._id, email: foundUser.email},
            process.env.SECRETKEY,
            {expiresIn: "10m"}
        );

        return res.status(201).send({message: "user login successfully", user: {email: email, isVerified: foundUser.isVerified, token: token, profile: foundUser.profile}})

    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const LogoutController = async (req, res)=>{
    try {
        return res.status(201).send({message: "user logout successfully"});    
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const ForgotPassController = async (req, res)=>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).send({message: "email is required"});
        }
        const foundUser = await authModel.findOne({ email });
        if(!foundUser){
            return res.status(404).send({message: "user not found..."})
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        const expireOtp = Date.now() + 10 * 60 * 1000;

        await otpModel.create({
            email: email,
            otp: otp,
            expireAt: expireOtp,
            purpose: "forgot_password"
        })

        await sendEmailOtp(
            email,
            "Reset Password Otp send to valid Email",
            otpTemplate(foundUser.name, otp)
        )

        return res.status(201).send({message: "otp send to your email for reset password"})

    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const OtpForForgotPass = async (req, res) => {
    try {
      const {email, otp, purpose} = req.body;
      
      if(!email || !otp || !purpose){
        return res.status(400).send({message: "something is missing..."});
      }

      const userRecord = await otpModel.findOne({email});

      if(!userRecord){
        return res.status(404).send({message: "user record not found..."});
      }

      if(userRecord.otp !== otp || userRecord.purpose !== purpose){
        return res.status(400).send({message: "invalid otp or purpose..."});
      }

      if(userRecord.expireAt < Date.now()){
        return res.status(400).send({message: "expire otp please generate new otp..."});
        await otpModel.deleteOne({_id: userRecord._id});
      }

      await otpModel.deleteOne({_id: userRecord._id});

      return res.status(201).send({message: "otp verification successfully..."});
      
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  };
  
const ResetPassController = async (req, res)=>{
    try {
        const {newPassword, email} = req.body;

        if(!newPassword || !email){
            return res.status(400).send({message: "something is missing..."});
        }

        const foundUser = await authModel.findOne({ email });

        if(!foundUser){
            return res.status(404).send({message: "user not found..."});
        }

        foundUser.password = newPassword;
        foundUser.save();

        return res.status(201).send({message: "password reset successfully..."});

    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

export {SignupController, OtpForSignup, LoginController, LogoutController, ForgotPassController, OtpForForgotPass, ResetPassController};