import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  mysqlEnum,
  json,
} from "drizzle-orm/mysql-core";

// Users table (already exists)
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Guardian-IO specific tables

// Worker Rights Reports
export const workerReports = mysqlTable("worker_reports", {
  id: int("id").autoincrement().primaryKey(),
  reportId: varchar("reportId", { length: 16 }).notNull().unique(), // Anonymous ID like #A7F2E8
  userId: int("userId"),
  incidentType: mysqlEnum("incidentType", [
    "harassment",
    "wage-theft",
    "unsafe-conditions",
    "trafficking",
    "other",
  ]).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  escalationPath: mysqlEnum("escalationPath", ["ngo", "government", "internal", "anonymous"]).notNull(),
  status: mysqlEnum("status", ["submitted", "under-review", "escalated", "resolved"]).default("submitted").notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  attachments: json("attachments").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Products with traceability data
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  productId: varchar("productId", { length: 16 }).notNull().unique(), // QR code ID
  name: varchar("name", { length: 255 }).notNull(),
  origin: varchar("origin", { length: 255 }).notNull(),
  workerCount: int("workerCount").notNull(),
  fairWageInfo: text("fairWageInfo").notNull(),
  environmentalImpact: text("environmentalImpact").notNull(),
  biodiversityProtection: text("biodiversityProtection").notNull(),
  communityBenefits: text("communityBenefits").notNull(),
  story: text("story").notNull(),
  impactMetrics: json("impactMetrics").$type<Array<{ label: string; value: string }>>().notNull(),
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "verified", "certified"]).default("verified").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Biodiversity incidents
export const biodiversityIncidents = mysqlTable("biodiversity_incidents", {
  id: int("id").autoincrement().primaryKey(),
  incidentId: varchar("incidentId", { length: 16 }).notNull().unique(),
  userId: int("userId"),
  incidentType: mysqlEnum("incidentType", [
    "poaching",
    "habitat-loss",
    "trafficking",
    "sighting",
  ]).notNull(),
  species: varchar("species", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  severity: mysqlEnum("severity", ["critical", "high", "medium", "low"]).notNull(),
  description: text("description").notNull(),
  reportCount: int("reportCount").default(1).notNull(),
  attachments: json("attachments").$type<string[]>(),
  status: mysqlEnum("status", ["active", "monitoring", "resolved"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Hotspot zones for biodiversity protection
export const hotspotZones = mysqlTable("hotspot_zones", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["active", "monitoring", "resolved"]).default("active").notNull(),
  incidentCount: int("incidentCount").default(0).notNull(),
  species: json("species").$type<string[]>().notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  radius: int("radius"), // in kilometers
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Community contributions and rewards
export const communityContributions = mysqlTable("community_contributions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contributionType: mysqlEnum("contributionType", [
    "report",
    "observation",
    "support",
    "purchase",
  ]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  points: int("points").default(0).notNull(),
  description: text("description"),
  relatedId: varchar("relatedId", { length: 16 }), // Reference to report, incident, or product
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Impact ledger for tracking outcomes
export const impactLedger = mysqlTable("impact_ledger", {
  id: int("id").autoincrement().primaryKey(),
  metricType: mysqlEnum("metricType", [
    "workers-protected",
    "species-protected",
    "forest-preserved",
    "wages-improved",
    "community-fund",
  ]).notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(), // e.g., "people", "acres", "dollars"
  description: text("description"),
  relatedId: varchar("relatedId", { length: 16 }), // Reference to report, incident, or product
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type WorkerReport = typeof workerReports.$inferSelect;
export type InsertWorkerReport = typeof workerReports.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type BiodiversityIncident = typeof biodiversityIncidents.$inferSelect;
export type InsertBiodiversityIncident = typeof biodiversityIncidents.$inferInsert;

export type HotspotZone = typeof hotspotZones.$inferSelect;
export type InsertHotspotZone = typeof hotspotZones.$inferInsert;

export type CommunityContribution = typeof communityContributions.$inferSelect;
export type InsertCommunityContribution = typeof communityContributions.$inferInsert;

export type ImpactLedger = typeof impactLedger.$inferSelect;
export type InsertImpactLedger = typeof impactLedger.$inferInsert;
