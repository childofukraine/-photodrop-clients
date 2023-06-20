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
exports.UserRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = __importDefault(require("../db/database"));
const schema_1 = require("../db/schema");
const { db } = database_1.default;
class UserRepository {
    static getUserByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db
                .select()
                .from(schema_1.clientTable)
                .leftJoin(schema_1.clientSelfiesTable, (0, drizzle_orm_1.eq)(schema_1.clientTable.selfieId, schema_1.clientSelfiesTable.selfieId))
                .where((0, drizzle_orm_1.eq)(schema_1.clientTable.phone, phone));
            if (!user.length)
                return null;
            return user;
        });
    }
    static saveUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.insert(schema_1.clientTable).values(newUser);
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db
                .select()
                .from(schema_1.clientTable)
                .leftJoin(schema_1.clientSelfiesTable, (0, drizzle_orm_1.eq)(schema_1.clientTable.selfieId, schema_1.clientSelfiesTable.selfieId))
                .where((0, drizzle_orm_1.eq)(schema_1.clientTable.clientId, id));
            if (!user.length)
                return null;
            if (!user[0].pdc_client.fullName) {
                user[0].pdc_client.fullName = '';
            }
            return user;
        });
    }
    static updateUserSelfie(selfieId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db
                .update(schema_1.clientTable)
                .set({ selfieId: selfieId })
                .where((0, drizzle_orm_1.eq)(schema_1.clientTable.clientId, userId));
        });
    }
    static updateUserName(name, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db
                .update(schema_1.clientTable)
                .set({ fullName: name })
                .where((0, drizzle_orm_1.eq)(schema_1.clientTable.clientId, userId));
        });
    }
    static updateUserEmail(email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db
                .update(schema_1.clientTable)
                .set({ email: email })
                .where((0, drizzle_orm_1.eq)(schema_1.clientTable.clientId, userId));
        });
    }
}
exports.UserRepository = UserRepository;
