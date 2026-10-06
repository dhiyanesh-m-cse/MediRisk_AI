import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { healthMaterials, patientAssessments, patientProfiles, type HealthMaterial, type PatientAssessment, type PatientProfile, type InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPatientProfile(userId: number): Promise<PatientProfile | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.select().from(patientProfiles).where(eq(patientProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function createOrUpdatePatientProfile(userId: number, displayName: string): Promise<PatientProfile> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(patientProfiles).values({ userId, displayName }).onDuplicateKeyUpdate({ set: { displayName } });
  const profile = await getPatientProfile(userId);
  if (!profile) throw new Error("Profile could not be saved");
  return profile;
}

export async function createPatientAssessment(userId: number, assessment: Omit<typeof patientAssessments.$inferInsert, "userId" | "id" | "assessedAt">): Promise<PatientAssessment> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const insert = await db.insert(patientAssessments).values({ ...assessment, userId });
  const record = await db.select().from(patientAssessments).where(and(eq(patientAssessments.userId, userId), eq(patientAssessments.id, Number(insert[0].insertId)))).limit(1);
  if (!record[0]) throw new Error("Assessment could not be saved");
  return record[0];
}

export async function listPatientAssessments(userId: number): Promise<PatientAssessment[]> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  return db.select().from(patientAssessments).where(eq(patientAssessments.userId, userId)).orderBy(desc(patientAssessments.assessedAt));
}

export async function createHealthMaterial(userId: number, material: Omit<typeof healthMaterials.$inferInsert, "userId" | "id" | "createdAt">): Promise<HealthMaterial> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const insert = await db.insert(healthMaterials).values({ ...material, userId });
  const record = await db.select().from(healthMaterials).where(and(eq(healthMaterials.userId, userId), eq(healthMaterials.id, Number(insert[0].insertId)))).limit(1);
  if (!record[0]) throw new Error("Health material could not be saved");
  return record[0];
}

export async function listHealthMaterials(userId: number): Promise<HealthMaterial[]> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  return db.select().from(healthMaterials).where(eq(healthMaterials.userId, userId)).orderBy(desc(healthMaterials.createdAt));
}

export async function getHealthMaterialForUser(userId: number, materialId: number): Promise<HealthMaterial | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const record = await db.select().from(healthMaterials).where(and(eq(healthMaterials.userId, userId), eq(healthMaterials.id, materialId))).limit(1);
  return record[0];
}

export async function deleteHealthMaterial(userId: number, materialId: number): Promise<HealthMaterial | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const record = await db.select().from(healthMaterials).where(and(eq(healthMaterials.userId, userId), eq(healthMaterials.id, materialId))).limit(1);
  if (!record[0]) return undefined;
  await db.delete(healthMaterials).where(and(eq(healthMaterials.userId, userId), eq(healthMaterials.id, materialId)));
  return record[0];
}
