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
const drizzle_orm_1 = require("drizzle-orm");
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../db/database"));
const schema_1 = require("../db/schema");
const album_1 = require("../entities/album");
const photo_1 = require("../entities/photo");
const { db } = database_1.default;
class AlbumRepository {
    static getAlbumByAlbumIdAndUserId(albumId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const album = yield db
                .select()
                .from(schema_1.clientAlbumsTable)
                .innerJoin(schema_1.albumsTable, (0, drizzle_orm_1.eq)(schema_1.albumsTable.albumId, schema_1.clientAlbumsTable.albumId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.clientAlbumsTable.clientId, userId), (0, drizzle_orm_1.eq)(schema_1.albumsTable.albumId, albumId)));
            if (!album.length)
                return null;
            return album[0].pd_albums;
        });
    }
    static getAlbumsByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const albums = yield db
                .select({ albumId: schema_1.albumsTable.albumId })
                .from(schema_1.photosTable)
                .innerJoin(schema_1.albumsTable, (0, drizzle_orm_1.eq)(schema_1.photosTable.albumId, schema_1.albumsTable.albumId))
                .where((0, drizzle_orm_1.like)(schema_1.photosTable.clients, `%${phone}%`));
            if (!albums.length)
                return null;
            return albums;
        });
    }
    static getUserAlbumByUserIdAndAlbumId(userId, albumId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAlbums = yield db
                .select()
                .from(schema_1.clientAlbumsTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.clientAlbumsTable.albumId, albumId), (0, drizzle_orm_1.eq)(schema_1.clientAlbumsTable.clientId, userId)));
            if (!userAlbums.length)
                return null;
            return userAlbums;
        });
    }
    static createRecordUserAlbum(userId, albumId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db
                .insert(schema_1.clientAlbumsTable)
                .values({ albumId: albumId, clientId: userId });
        });
    }
    static getAllAlbumsWithPhotosByUserIdAndPhone(userId, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const mapped = new Map();
            const albumsWithPhotos = yield db
                .select({
                albumId: schema_1.clientAlbumsTable.albumId,
                name: schema_1.albumsTable.name,
                location: schema_1.albumsTable.location,
                createdAt: schema_1.albumsTable.createdAt,
                isUnlocked: schema_1.clientAlbumsTable.isUnlocked,
                photos: schema_1.photosTable,
            })
                .from(schema_1.clientAlbumsTable)
                .innerJoin(schema_1.photosTable, (0, drizzle_orm_1.eq)(schema_1.photosTable.albumId, schema_1.clientAlbumsTable.albumId))
                .innerJoin(schema_1.albumsTable, (0, drizzle_orm_1.eq)(schema_1.albumsTable.albumId, schema_1.clientAlbumsTable.albumId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.clientAlbumsTable.clientId, userId), (0, drizzle_orm_1.like)(schema_1.photosTable.clients, `%${phone}%`)));
            if (!albumsWithPhotos.length)
                return null;
            const uniqAlbumsIds = [...new Set(albumsWithPhotos.map((a) => a.albumId))];
            const photos = albumsWithPhotos
                .map((p) => p.photos)
                .filter((value, index, self) => self.findIndex((m) => m.photoId === value.photoId) === index)
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            uniqAlbumsIds.forEach((id) => {
                const albumInfo = albumsWithPhotos.find((album) => album.albumId === id);
                const sortedPhotosByAlbumId = photos.filter((photo) => photo.albumId === id);
                const cover = sortedPhotosByAlbumId[0].unlockedThumbnailUrl;
                const preparedPhotos = [];
                if (albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.isUnlocked) {
                    sortedPhotosByAlbumId.forEach((p) => preparedPhotos.push(new photo_1.Photo(p.photoId, p.unlockedPhotoUrl, p.unlockedThumbnailUrl, p.createdAt, p.albumId)));
                }
                else {
                    sortedPhotosByAlbumId.forEach((p) => preparedPhotos.push(new photo_1.Photo(p.photoId, p.lockedPhotoUrl, p.lockedThumbnailUrl, p.createdAt, p.albumId)));
                }
                const preparedAlbum = new album_1.Album(albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.albumId, albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.name, albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.location, albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.createdAt, albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.isUnlocked, cover, preparedPhotos);
                mapped.set(id, preparedAlbum);
            });
            return Array.from(mapped.values());
        });
    }
    static getAllAlbumWithPhotosByUserIdAndPhoneAndAlbumId(userId, phone, albumId) {
        return __awaiter(this, void 0, void 0, function* () {
            const albumWithPhotos = yield db
                .select({
                albumId: schema_1.clientAlbumsTable.albumId,
                name: schema_1.albumsTable.name,
                location: schema_1.albumsTable.location,
                createdAt: schema_1.albumsTable.createdAt,
                isUnlocked: schema_1.clientAlbumsTable.isUnlocked,
                photos: schema_1.photosTable,
            })
                .from(schema_1.clientAlbumsTable)
                .innerJoin(schema_1.photosTable, (0, drizzle_orm_1.eq)(schema_1.photosTable.albumId, schema_1.clientAlbumsTable.albumId))
                .innerJoin(schema_1.albumsTable, (0, drizzle_orm_1.eq)(schema_1.albumsTable.albumId, schema_1.clientAlbumsTable.albumId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.clientAlbumsTable.clientId, userId), (0, drizzle_orm_1.like)(schema_1.photosTable.clients, `%${phone}%`), (0, drizzle_orm_1.eq)(schema_1.albumsTable.albumId, albumId)));
            if (!albumWithPhotos.length)
                return null;
            const photos = albumWithPhotos
                .map((p) => p.photos)
                .filter((value, index, self) => self.findIndex((m) => m.photoId === value.photoId) === index)
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            const albumInfo = albumWithPhotos.find((album) => album.albumId === albumId);
            const sortedPhotosByAlbumId = photos.filter((photo) => photo.albumId === albumId);
            const cover = sortedPhotosByAlbumId[0].unlockedThumbnailUrl;
            const preparedPhotos = [];
            if (albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.isUnlocked) {
                sortedPhotosByAlbumId.forEach((p) => preparedPhotos.push(new photo_1.Photo(p.photoId, p.unlockedPhotoUrl, p.unlockedThumbnailUrl, p.createdAt, p.albumId)));
            }
            else {
                sortedPhotosByAlbumId.forEach((p) => preparedPhotos.push(new photo_1.Photo(p.photoId, p.lockedPhotoUrl, p.lockedThumbnailUrl, p.createdAt, p.albumId)));
            }
            const albumCreatedAtMoment = (0, moment_1.default)(albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.createdAt).format("MMM D, YYYY");
            const preparedAlbum = new album_1.Album(albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.albumId, albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.name, albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.location, albumCreatedAtMoment, albumInfo === null || albumInfo === void 0 ? void 0 : albumInfo.isUnlocked, cover, preparedPhotos);
            return preparedAlbum;
        });
    }
}
exports.default = AlbumRepository;
