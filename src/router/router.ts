import Router from "express";
import { AuthController } from "../controllers/authController";
import AuthValidator from "../validators/authValidator";

export const router = Router();

router.post(
  "/sign-in/send-otp",
  AuthValidator.checkSendOtpBody,
  AuthController.sendOtp
);

router.post(
  "/sign-in/verify-otp",
  AuthValidator.checkVerifyOtpBody,
  AuthController.verifyOtp
);

router.post("/refresh", AuthValidator.checkCookies, AuthController.refresh);
