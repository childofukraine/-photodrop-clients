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
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../repositories/user");
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
const isAuthorized = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            throw boom_1.default.unauthorized("Invalid token.");
        }
        let clientId;
        jsonwebtoken_1.default.verify(token, tokenSecret, (err, encoded) => {
            if (err)
                throw boom_1.default.unauthorized("Token expired");
            clientId = encoded
                .clientId;
        });
        const user = user_1.UserRepository.getUserById(clientId);
        if (!user)
            throw boom_1.default.unauthorized("Invalid token.");
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.default = isAuthorized;
