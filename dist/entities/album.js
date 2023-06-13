"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = void 0;
class Album {
    constructor(albumId, name, location, createdAt, isUnlocked, cover, photos) {
        this.albumId = albumId;
        this.name = name;
        this.location = location;
        this.createdAt = createdAt;
        this.isUnlocked = isUnlocked;
        this.cover = cover;
        this.photos = photos;
    }
}
exports.Album = Album;
