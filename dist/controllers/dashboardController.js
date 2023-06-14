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
exports.DashboardController = void 0;
const boom_1 = require("@hapi/boom");
const album_1 = __importDefault(require("../repositories/album"));
const user_1 = require("../repositories/user");
class DashboardController {
}
exports.DashboardController = DashboardController;
_a = DashboardController;
DashboardController.getAllAlbums = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const clientId = getClientIdFromToken(
    //   req.header("Authorization")?.replace("Bearer ", "")!
    // );
    const clientId = "7e264b8e-5cc9-4ebe-b864-a4e848f6ed57";
    try {
        const user = yield user_1.UserRepository.getUserById(clientId);
        if (!user)
            throw (0, boom_1.notFound)();
        let { phone } = user[0].pdc_client;
        if (phone[0] === "+")
            phone = phone.slice(1);
        const albumsIds = yield album_1.default.getAlbumsByPhone(phone);
        if (albumsIds) {
            const uniqAlbumsIds = [...new Set(albumsIds.map((a) => a.albumId))];
            uniqAlbumsIds.map((albumId) => album_1.default.getUserAlbumByUserIdAndAlbumId(clientId, albumId).then((query) => __awaiter(void 0, void 0, void 0, function* () {
                if (!query) {
                    yield album_1.default.createRecordUserAlbum(clientId, albumId);
                }
            })));
        }
        const albumsWithPhotos = yield album_1.default.getAllAlbumsWithPhotosByUserIdAndPhone(clientId, phone);
        const noAlbumsResult = [];
        if (!albumsWithPhotos) {
            res.status(200).json(noAlbumsResult);
        }
        res.status(200).json(albumsWithPhotos);
    }
    catch (e) {
        next(e);
    }
});
DashboardController.getAlbumById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const clientId = getClientIdFromToken(
    //     req.header("Authorization")?.replace("Bearer ", "")!
    //     );
    const clientId = "7e264b8e-5cc9-4ebe-b864-a4e848f6ed57";
    const { albumId } = req.params;
    try {
        const user = yield user_1.UserRepository.getUserById(clientId);
        if (!user)
            throw (0, boom_1.notFound)();
        let { phone } = user[0].pdc_client;
        if (phone[0] === "+")
            phone = phone.slice(1);
        const albumWithPhotos = yield album_1.default.getAllAlbumWithPhotosByUserIdAndPhoneAndAlbumId(clientId, phone, albumId);
        if (!albumWithPhotos)
            throw (0, boom_1.notFound)();
        res.status(200).json(albumWithPhotos);
    }
    catch (e) {
        next(e);
    }
});
