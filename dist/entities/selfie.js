"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Selfie {
    constructor(selfieId, selfieUrl, selfieThumbnail, shiftX, shiftY, zoom, width, height) {
        this.selfieId = selfieId;
        this.selfieUrl = selfieUrl;
        this.selfieThumbnail = selfieThumbnail;
        this.shiftX = shiftX;
        this.shiftY = shiftY;
        this.zoom = zoom;
        this.width = width;
        this.height = height;
    }
}
exports.default = Selfie;
