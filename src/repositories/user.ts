import { eq } from "drizzle-orm";
import database from "../db/database";
import { clientSelfiesTable, clientTable } from "../db/schema";
import { User } from "../entities/user";
import { UserWithSelfie } from "../types";



const {db}  = database


export class UserRepository {
  static async getUserByPhone(phone: string): Promise<UserWithSelfie[] | null> {
    const user = await db
      .select()
      .from(clientTable)
      .leftJoin(
        clientSelfiesTable,
        eq(clientTable.selfieId, clientSelfiesTable.selfieId),
      )
      .where(eq(clientTable.phone, phone));
    if (!user.length) return null;
    return user;
  }

  static async saveUser(newUser: User): Promise<void> {
    await db.insert(clientTable).values(newUser);
  }

  static async getUserById(id: string): Promise<UserWithSelfie[] | null> {
    const user = await db
      .select()
      .from(clientTable)
      .leftJoin(
        clientSelfiesTable,
        eq(clientTable.selfieId, clientSelfiesTable.selfieId),
      )
      .where(eq(clientTable.clientId, id));
    if (!user.length) return null;
    if (!user[0].pdc_client.fullName) {
      user[0].pdc_client.fullName = ''
    }
    return user;
  }

  static async updateUserSelfie(
    selfieId: string,
    userId: string,
  ): Promise<void> {
    await db
      .update(clientTable)
      .set({ selfieId: selfieId })
      .where(eq(clientTable.clientId, userId));
  }

  static async updateUserName(name: string, userId: string): Promise<void> {
    await db
      .update(clientTable)
      .set({ fullName: name })
      .where(eq(clientTable.clientId, userId));
  }

  static async updateUserEmail(email: string, userId: string): Promise<void> {
    await db
      .update(clientTable)
      .set({ email: email })
      .where(eq(clientTable.clientId, userId));
  }
}