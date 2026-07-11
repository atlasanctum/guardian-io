import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/drizzle/schema";

let db: ReturnType<typeof drizzle> | null = null;

export async function initializeDatabase() {
  if (db) return db;

  try {
    const poolConnection = await mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "guardian_io",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0,
    });

    db = drizzle(poolConnection, { schema });
    console.log("✅ Database connected successfully");
    return db;
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return db;
}

// Database query helpers
export const dbQueries = {
  // Worker Reports
  async createWorkerReport(data: {
    userId: string;
    reportType: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    escalationPath: string;
    attachments: string[];
    anonymous: boolean;
  }) {
    const database = getDatabase();
    const result = await database.insert(schema.workerReports).values({
      userId: data.userId,
      reportType: data.reportType,
      description: data.description,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      escalationPath: data.escalationPath,
      attachments: JSON.stringify(data.attachments),
      anonymous: data.anonymous,
      status: "submitted",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  },

  async getWorkerReports(userId: string, limit = 10, offset = 0) {
    const database = getDatabase();
    return database
      .select()
      .from(schema.workerReports)
      .where((t) => t.userId === userId)
      .limit(limit)
      .offset(offset);
  },

  async updateReportStatus(reportId: number, status: string) {
    const database = getDatabase();
    return database
      .update(schema.workerReports)
      .set({ status, updatedAt: new Date() })
      .where((t) => t.id === reportId);
  },

  // Biodiversity Incidents
  async createIncident(data: {
    userId: string;
    incidentType: string;
    description: string;
    latitude: number;
    longitude: number;
    severity: "low" | "medium" | "high" | "critical";
    speciesAffected: string[];
    attachments: string[];
  }) {
    const database = getDatabase();
    return database.insert(schema.biodiversityIncidents).values({
      userId: data.userId,
      incidentType: data.incidentType,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      severity: data.severity,
      speciesAffected: JSON.stringify(data.speciesAffected),
      attachments: JSON.stringify(data.attachments),
      status: "reported",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async getIncidentsByLocation(latitude: number, longitude: number, radiusKm = 50) {
    const database = getDatabase();
    // Simplified distance calculation (in production, use PostGIS or similar)
    return database
      .select()
      .from(schema.biodiversityIncidents)
      .where(
        (t) =>
          Math.abs(t.latitude - latitude) < radiusKm / 111 &&
          Math.abs(t.longitude - longitude) < radiusKm / 111,
      );
  },

  // Products
  async getProductByQRCode(qrCode: string) {
    const database = getDatabase();
    return database
      .select()
      .from(schema.products)
      .where((t) => t.qrCode === qrCode)
      .limit(1);
  },

  async createProduct(data: {
    name: string;
    description: string;
    qrCode: string;
    origin: string;
    workerInfo: string;
    fairWages: boolean;
    environmentalImpact: string;
    communityBenefits: string;
  }) {
    const database = getDatabase();
    return database.insert(schema.products).values({
      name: data.name,
      description: data.description,
      qrCode: data.qrCode,
      origin: data.origin,
      workerInfo: data.workerInfo,
      fairWages: data.fairWages,
      environmentalImpact: data.environmentalImpact,
      communityBenefits: data.communityBenefits,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  // Contributions
  async createContribution(data: {
    userId: string;
    type: string;
    points: number;
    description: string;
    metadata: Record<string, any>;
  }) {
    const database = getDatabase();
    return database.insert(schema.contributions).values({
      userId: data.userId,
      type: data.type,
      points: data.points,
      description: data.description,
      metadata: JSON.stringify(data.metadata),
      createdAt: new Date(),
    });
  },

  async getUserContributions(userId: string) {
    const database = getDatabase();
    return database
      .select()
      .from(schema.contributions)
      .where((t) => t.userId === userId)
      .orderBy((t) => t.createdAt);
  },

  async getUserTotalPoints(userId: string) {
    const database = getDatabase();
    const result = await database
      .select()
      .from(schema.contributions)
      .where((t) => t.userId === userId);

    return result.reduce((sum, c) => sum + c.points, 0);
  },

  // Impact Metrics
  async getGlobalImpactMetrics() {
    const database = getDatabase();
    const metrics = await database.select().from(schema.impactMetrics).limit(1);
    return metrics[0] || null;
  },

  async updateImpactMetrics(data: {
    workersProtected: number;
    speciesProtected: number;
    forestPreserved: number;
    wagesImproved: number;
    communityFund: number;
  }) {
    const database = getDatabase();
    const existing = await database.select().from(schema.impactMetrics).limit(1);

    if (existing.length > 0) {
      return database
        .update(schema.impactMetrics)
        .set({
          workersProtected: data.workersProtected,
          speciesProtected: data.speciesProtected,
          forestPreserved: data.forestPreserved,
          wagesImproved: data.wagesImproved,
          communityFund: data.communityFund,
          updatedAt: new Date(),
        })
        .where((t) => t.id === existing[0].id);
    } else {
      return database.insert(schema.impactMetrics).values({
        workersProtected: data.workersProtected,
        speciesProtected: data.speciesProtected,
        forestPreserved: data.forestPreserved,
        wagesImproved: data.wagesImproved,
        communityFund: data.communityFund,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  },

  // Leaderboard
  async getLeaderboard(limit = 100) {
    const database = getDatabase();
    const result = await database
      .select()
      .from(schema.contributions)
      .groupBy((t) => t.userId);

    return result
      .map((c) => ({
        userId: c.userId,
        totalPoints: c.points,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);
  },

  async getUserRank(userId: string) {
    const leaderboard = await this.getLeaderboard(10000);
    const rank = leaderboard.findIndex((entry) => entry.userId === userId) + 1;
    return rank > 0 ? rank : null;
  },
};
