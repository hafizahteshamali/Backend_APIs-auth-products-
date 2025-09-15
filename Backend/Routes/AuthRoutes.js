import express from "express";
import { ForgotPassController, LoginController, LogoutController, OtpForForgotPass, OtpForSignup, ResetPassController, SignupController } from "../Controllers/AuthControllers.js";
import upload from "../utils/uploadProfile.js";

const appRoutes = express.Router();

appRoutes.post("/signup", upload.single("profile"), SignupController);
appRoutes.post("/otp_for_signup", OtpForSignup);
appRoutes.post("/login", LoginController);
appRoutes.post("/logout", LogoutController);
appRoutes.post("/forgot_password", ForgotPassController);
appRoutes.post("/otp_for_forgot_pass", OtpForForgotPass);
appRoutes.post("/reset_password", ResetPassController);

export default appRoutes;