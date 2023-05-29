import { eq } from "drizzle-orm";
import database from "../db/database";
import { clientSessionsTable, PDCSession } from "../db/schema";
import Session from "../entities/session";

const { db } = database;

export class SessionRepository {
  static async saveSession(newSession: Session): Promise<void> {
    await db.insert(clientSessionsTable).values(newSession);
  }

  static async getSessionByRefreshToken(
    refreshToken: string
  ): Promise<PDCSession[] | null> {
    const session = await db
      .select()
      .from(clientSessionsTable)
      .where(eq(clientSessionsTable.refreshToken, refreshToken));
    if (!session.length) return null;
    return session;
  }

  static async deleteSessionById(id: string): Promise<void> {
    await db
      .delete(clientSessionsTable)
      .where(eq(clientSessionsTable.sessionId, id));
  }

  static async updateSessionById(
    newSession: PDCSession,
    id: string
  ): Promise<void> {
    await db
      .update(clientSessionsTable)
      .set(newSession)
      .where(eq(clientSessionsTable.sessionId, id));
  }
}
