"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const dashboardController_1 = require("../controllers/dashboardController");
const userController_1 = __importDefault(require("../controllers/userController"));
const multer_1 = require("../libs/multer");
const authValidator_1 = __importDefault(require("../validators/authValidator"));
const userValidator_1 = __importDefault(require("../validators/userValidator"));
exports.router = (0, express_1.default)();
exports.router.post("/sign-in/send-otp", authValidator_1.default.checkSendOtpBody, authController_1.AuthController.sendOtp);
exports.router.post("/sign-in/verify-otp", authValidator_1.default.checkVerifyOtpBody, authController_1.AuthController.verifyOtp);
exports.router.post("/refresh", authValidator_1.default.checkCookies, authController_1.AuthController.refresh);
exports.router.post("/upload-selfie", 
// isAuthorized,
multer_1.upload.single("files"), userValidator_1.default.checkUploadSelfieBody, userController_1.default.uploadSelfie);
exports.router.get("/get-all", 
// isAuthorized,
dashboardController_1.DashboardController.getAllAlbums);
exports.router.get("/album/:albumId", 
// isAuthorized,
dashboardController_1.DashboardController.getAlbumById);
