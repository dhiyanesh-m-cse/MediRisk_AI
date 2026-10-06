import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const patientProfiles = mysqlTable("patientProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  displayName: varchar("displayName", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("patientProfiles_userId_unique").on(table.userId)]);

export const patientAssessments = mysqlTable("patientAssessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  patientName: varchar("patientName", { length: 100 }).notNull(),
  riskScore: int("riskScore").notNull(),
  riskLevel: varchar("riskLevel", { length: 24 }).notNull(),
  heartRate: int("heartRate").notNull(),
  systolicBP: int("systolicBP").notNull(),
  diastolicBP: int("diastolicBP").notNull(),
  oxygenSaturation: int("oxygenSaturation").notNull(),
  temperature: varchar("temperature", { length: 16 }).notNull(),
  assessmentPayload: text("assessmentPayload").notNull(),
  assessedAt: timestamp("assessedAt").defaultNow().notNull(),
}, (table) => [index("patientAssessments_userId_assessedAt_idx").on(table.userId, table.assessedAt)]);

export const healthMaterialType = mysqlEnum("healthMaterialType", ["report", "medical_history", "patient_image"]);

export const healthMaterials = mysqlTable("healthMaterials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: healthMaterialType.notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  originalFilename: varchar("originalFilename", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 127 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  storageKey: varchar("storageKey", { length: 700 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 800 }).notNull(),
  notes: text("notes"),
  materialDate: timestamp("materialDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("healthMaterials_userId_createdAt_idx").on(table.userId, table.createdAt)]);

export type PatientProfile = typeof patientProfiles.$inferSelect;
export type PatientAssessment = typeof patientAssessments.$inferSelect;
export type HealthMaterial = typeof healthMaterials.$inferSelect;
