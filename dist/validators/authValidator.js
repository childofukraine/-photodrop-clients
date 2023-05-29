"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
class AuthValidator {
}
exports.default = AuthValidator;
AuthValidator.checkSendOtpBody = (req, res, next) => {
    var _a, _b;
    try {
        const schema = joi_1.default.object({
            phoneNumber: joi_1.default.number().required(),
            countryCode: joi_1.default.number().required(),
        });
        const value = schema.validate(req.body);
        if ((_a = value.error) === null || _a === void 0 ? void 0 : _a.message)
            throw boom_1.default.badData((_b = value.error) === null || _b === void 0 ? void 0 : _b.message);
        next();
    }
    catch (err) {
        next(err);
    }
};
AuthValidator.checkVerifyOtpBody = (req, res, next) => {
    var _a, _b;
    try {
        const schema = joi_1.default.object({
            phoneNumber: joi_1.default.number().required(),
            countryCode: joi_1.default.number().required(),
            otp: joi_1.default.number().required(),
        });
        const value = schema.validate(req.body);
        if ((_a = value.error) === null || _a === void 0 ? void 0 : _a.message)
            throw boom_1.default.badData((_b = value.error) === null || _b === void 0 ? void 0 : _b.message);
        next();
    }
    catch (err) {
        next(err);
    }
};
AuthValidator.checkCookies = (req, res, next) => {
    var _a, _b;
    try {
        const schema = joi_1.default.object({
            refreshToken: joi_1.default.string().required(),
        });
        const value = schema.validate(req.cookies);
        if ((_a = value.error) === null || _a === void 0 ? void 0 : _a.message)
            throw boom_1.default.badData((_b = value.error) === null || _b === void 0 ? void 0 : _b.message);
        next();
    }
    catch (err) {
        next(err);
    }
};
