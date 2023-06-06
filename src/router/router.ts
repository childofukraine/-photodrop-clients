import Router from "express";
import { AuthController } from "../controllers/authController";
import UserController from "../controllers/userController";
import { upload } from "../libs/multer";
import isAuthorized from "../middlewares/isAuthorized";
import AuthValidator from "../validators/authValidator";
import UserValidator from "../validators/userValidator";

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


router.post(
  "/upload-selfie",
  // isAuthorized,
  upload.single("files"),
  UserValidator.checkUploadSelfieBody,
  UserController.uploadSelfie,
);
