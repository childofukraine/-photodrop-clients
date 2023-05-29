"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authValidator_1 = __importDefault(require("../validators/authValidator"));
exports.router = (0, express_1.default)();
exports.router.post("/sign-in/send-otp", authValidator_1.default.checkSendOtpBody, authController_1.AuthController.sendOtp);
exports.router.post("/sign-in/verify-otp", authValidator_1.default.checkVerifyOtpBody, authController_1.AuthController.verifyOtp);
exports.router.post("/refresh", authValidator_1.default.checkCookies, authController_1.AuthController.refresh);
