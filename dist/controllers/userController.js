"use strict";
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
const uuid_1 = require("uuid");
const boom_1 = require("@hapi/boom");
const selfie_1 = __importDefault(require("../entities/selfie"));
const convertToPng_1 = require("../libs/convertToPng");
const getClientIdFromToken_1 = require("../libs/getClientIdFromToken");
const s3_1 = require("../libs/s3");
const thumbnails_1 = require("../libs/thumbnails");
const selfie_2 = __importDefault(require("../repositories/selfie"));
const user_1 = require("../repositories/user");
class UserController {
}
exports.default = UserController;
_a = UserController;
UserController.uploadSelfie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const clientId = (0, getClientIdFromToken_1.getClientIdFromToken)((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
    const selfie = req.file;
    const { shiftX, shiftY, zoom, width, height } = req.body;
    try {
        let file = selfie.buffer;
        let extName = (_c = selfie.originalname.split(".").pop()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        if (((_d = selfie.originalname.split(".").pop()) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === "heic") {
            file = yield (0, convertToPng_1.convertToPng)(file);
            extName = "png";
        }
        const selfieThumbnail = yield (0, thumbnails_1.thumbnail)(file);
        const newSelfie = new selfie_1.default((0, uuid_1.v4)(), yield (0, s3_1.uploadFileToS3)(file, extName), yield (0, s3_1.uploadFileToS3)(selfieThumbnail, "jpeg"), shiftX || 0, shiftY || 0, zoom || 0, width || 0, height || 0);
        yield selfie_2.default.saveSelfie(newSelfie);
        yield user_1.UserRepository.updateUserSelfie(newSelfie.selfieId, clientId);
        const updatedUser = yield user_1.UserRepository.getUserById(clientId);
        if (!updatedUser)
            throw (0, boom_1.notFound)();
        res.status(200).json({
            user: updatedUser[0].pdc_client,
            selfie: updatedUser[0].pdc_selfies,
        });
    }
    catch (e) {
        next(e);
    }
});
