import Selfie from "../entities/selfie";
import database from "../db/database";
import { clientSelfiesTable } from "../db/schema";

const { db } = database;

export default class SelfieRepository {
  static async saveSelfie(newSelfie: Selfie): Promise<void> {
    await db.insert(clientSelfiesTable).values(newSelfie);
  }
}