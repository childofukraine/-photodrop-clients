"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(clientId, phone, selfieId, email, fullName) {
        this.clientId = clientId;
        this.phone = phone;
        this.selfieId = selfieId;
        this.email = email;
        this.fullName = fullName;
    }
}
exports.User = User;
