"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const twilio_1 = require("twilio");
const boom_1 = __importStar(require("@hapi/boom"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const session_1 = require("../repositories/session");
const session_2 = __importDefault(require("../entities/session"));
const jwtGenerator_1 = require("../libs/jwtGenerator");
const user_1 = require("../repositories/user");
const user_2 = require("../entities/user");
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = new twilio_1.Twilio(accountSid, authToken);
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { countryCode, phoneNumber } = req.body;
    try {
        yield client.verify.v2
            .services(serviceSid)
            .verifications.create({
            to: `+${countryCode}${phoneNumber}`,
            channel: "sms",
        })
            .catch((e) => next(e));
        res.status(200).json({ message: "OTP sent." });
    }
    catch (e) {
        next(e);
    }
});
AuthController.verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { countryCode, phoneNumber, otp } = req.body;
    const fullPhone = `${countryCode}${phoneNumber}`;
    try {
        yield client.verify.v2
            .services(serviceSid)
            .verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp,
        })
            .then((r) => {
            if (!r.valid)
                throw boom_1.default.badRequest("Invalid otp code.");
        })
            .catch(() => {
            throw boom_1.default.badRequest("Invalid otp code.");
        });
        const user = yield user_1.UserRepository.getUserByPhone(fullPhone);
        if (user) {
            const tokens = (0, jwtGenerator_1.createTokens)(user[0].pdc_client.clientId);
            const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
            const sessionExpireTimestamp = new Date(refreshTokenExpTime);
            const newSession = new session_2.default((0, uuid_1.v4)(), user[0].pdc_client.clientId, tokens.refreshToken, sessionExpireTimestamp);
            yield session_1.SessionRepository.saveSession(newSession);
            res
                .cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
            })
                .json({
                accessToken: tokens.accessToken,
                user: user[0].pdc_client,
                selfie: user[0].pdc_selfies,
            });
        }
        else {
            const newUser = new user_2.User((0, uuid_1.v4)(), fullPhone);
            yield user_1.UserRepository.saveUser(newUser);
            const tokens = (0, jwtGenerator_1.createTokens)(newUser.clientId);
            const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
            const sessionExpireTimestamp = new Date(refreshTokenExpTime);
            const newSession = new session_2.default((0, uuid_1.v4)(), newUser.clientId, tokens.refreshToken, sessionExpireTimestamp);
            yield session_1.SessionRepository.saveSession(newSession);
            res
                .cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
            })
                .json({
                accessToken: tokens.accessToken,
                user: newUser,
            });
        }
    }
    catch (e) {
        next(e);
    }
});
AuthController.refresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const timeStamp = new Date(Date.now()).toJSON();
    try {
        const session = yield session_1.SessionRepository.getSessionByRefreshToken(refreshToken);
        if (!session)
            throw boom_1.default.badRequest("Invalid refresh token.");
        if (Date.parse(timeStamp) >=
            Date.parse(session[0].expiresIn)) {
            yield session_1.SessionRepository.deleteSessionById(session[0].sessionId);
            throw boom_1.default.unauthorized("Session is expired, please log-in.");
        }
        const newTokens = (0, jwtGenerator_1.createTokens)(session[0].clientId);
        const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
        const sessionExpireTimestamp = new Date(refreshTokenExpTime);
        const newSession = new session_2.default(session[0].sessionId, session[0].clientId, newTokens.refreshToken, sessionExpireTimestamp);
        yield session_1.SessionRepository.updateSessionById(newSession, newSession.sessionId);
        res
            .cookie("refreshToken", newTokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        })
            .json({ accessToken: newTokens.accessToken });
    }
    catch (e) {
        next(e);
    }
});
AuthController.me = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const clientId = getClientIdFromToken(
    //   req.header("Authorization")?.replace("Bearer ", "")!,
    // );
    const clientId = "7e264b8e-5cc9-4ebe-b864-a4e848f6ed57";
    try {
        const user = yield user_1.UserRepository.getUserById(clientId);
        if (!user)
            throw (0, boom_1.notFound)();
        res.json({
            user: user[0].pdc_client,
            selfie: user[0].pdc_selfies,
        });
    }
    catch (e) {
        next(e);
    }
});
