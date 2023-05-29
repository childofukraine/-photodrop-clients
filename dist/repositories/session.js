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
exports.SessionRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = __importDefault(require("../db/database"));
const schema_1 = require("../db/schema");
const { db } = database_1.default;
class SessionRepository {
    static saveSession(newSession) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.insert(schema_1.clientSessionsTable).values(newSession);
        });
    }
    static getSessionByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield db
                .select()
                .from(schema_1.clientSessionsTable)
                .where((0, drizzle_orm_1.eq)(schema_1.clientSessionsTable.refreshToken, refreshToken));
            if (!session.length)
                return null;
            return session;
        });
    }
    static deleteSessionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db
                .delete(schema_1.clientSessionsTable)
                .where((0, drizzle_orm_1.eq)(schema_1.clientSessionsTable.sessionId, id));
        });
    }
    static updateSessionById(newSession, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db
                .update(schema_1.clientSessionsTable)
                .set(newSession)
                .where((0, drizzle_orm_1.eq)(schema_1.clientSessionsTable.sessionId, id));
        });
    }
}
exports.SessionRepository = SessionRepository;
