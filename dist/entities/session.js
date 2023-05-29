"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Session {
    constructor(sessionId, clientId, refreshToken, expiresIn) {
        this.sessionId = sessionId;
        this.clientId = clientId;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
    }
}
exports.default = Session;
