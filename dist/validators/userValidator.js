"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
class UserValidator {
}
exports.default = UserValidator;
UserValidator.checkUpdateFullNameBody = (req, res, next) => {
    var _a, _b;
    try {
        const schema = joi_1.default.object({
            fullName: joi_1.default.string().required(),
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
UserValidator.checkUpdateEmailBody = (req, res, next) => {
    var _a, _b;
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
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
UserValidator.checkUploadSelfieBody = (req, res, next) => {
    var _a, _b;
    try {
        // const bodySchema = Joi.object({
        //   shiftX: Joi.number().required(),
        //   shiftY: Joi.number().required(),
        //   zoom: Joi.number().required(),
        //   width: Joi.number().required(),
        //   height: Joi.number().required(),
        // });
        const fileSchema = joi_1.default.object().required().label("files");
        // const valueBody = bodySchema.validate(req.body);
        // if (valueBody.error?.message)
        //   throw Boom.badData(valueBody.error?.message);
        const valueFile = fileSchema.validate(req.file);
        if ((_a = valueFile.error) === null || _a === void 0 ? void 0 : _a.message)
            throw boom_1.default.badData((_b = valueFile.error) === null || _b === void 0 ? void 0 : _b.message);
        next();
    }
    catch (err) {
        next(err);
    }
};
