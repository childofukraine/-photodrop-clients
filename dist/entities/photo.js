"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photo = void 0;
class Photo {
    constructor(photoId, url, thumbnail, createdAt, albumId) {
        this.photoId = photoId;
        this.url = url;
        this.thumbnail = thumbnail;
        this.createdAt = createdAt;
        this.albumId = albumId;
    }
}
exports.Photo = Photo;
