import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  workerReports,
  products,
  biodiversityIncidents,
  hotspotZones,
  communityContributions,
  impactLedger,
} from "@/drizzle/schema";
import { eq, desc, and, gte, lte, like } from "drizzle-orm";

// Initialize database connection
let db: ReturnType<typeof drizzle> | null = null;

export async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "guardian_io",
      port: parseInt(process.env.DB_PORT || "3306"),
    });

    db = drizzle(connection);
    console.log("Database connection established");
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return db;
}

// ============ Worker Reports ============

export async function createWorkerReport(data: {
  reportId: string;
  userId?: string | null;
  incidentType: string;
  description: string;
  location: string;
  escalationPath: string;
  status?: string;
  severity?: string;
}) {
  try {
    const result = await getDb()
      .insert(workerReports)
      .values({
        reportId: data.reportId,
        userId: data.userId || null,
        incidentType: data.incidentType,
        description: data.description,
        location: data.location,
        escalationPath: data.escalationPath,
        status: data.status || "submitted",
        severity: data.severity || "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: workerReports.id });

    return result[0]?.id;
  } catch (error) {
    console.error("Failed to create worker report:", error);
    throw error;
  }
}

export async function getWorkerReport(reportId: string) {
  try {
    const result = await getDb().query.workerReports.findFirst({
      where: eq(workerReports.reportId, reportId),
    });
    return result || null;
  } catch (error) {
    console.error("Failed to get worker report:", error);
    return null;
  }
}

export async function getUserWorkerReports(userId: string | null) {
  try {
    if (!userId) return [];

    const result = await getDb().query.workerReports.findMany({
      where: eq(workerReports.userId, userId),
      orderBy: [desc(workerReports.createdAt)],
      limit: 50,
    });

    return result;
  } catch (error) {
    console.error("Failed to get user worker reports:", error);
    return [];
  }
}

export async function updateWorkerReportStatus(
  reportId: string,
  status: "submitted" | "under-review" | "escalated" | "resolved",
) {
  try {
    await getDb()
      .update(workerReports)
      .set({ status, updatedAt: new Date() })
      .where(eq(workerReports.reportId, reportId));
  } catch (error) {
    console.error("Failed to update worker report status:", error);
    throw error;
  }
}

export async function getRecentWorkerReports(limit: number = 20) {
  try {
    const result = await getDb().query.workerReports.findMany({
      orderBy: [desc(workerReports.createdAt)],
      limit,
    });
    return result;
  } catch (error) {
    console.error("Failed to get recent worker reports:", error);
    return [];
  }
}

// ============ Products ============

export async function getProduct(productId: string) {
  try {
    const result = await getDb().query.products.findFirst({
      where: eq(products.productId, productId),
    });
    return result || null;
  } catch (error) {
    console.error("Failed to get product:", error);
    return null;
  }
}

export async function getVerifiedProducts(limit: number = 100) {
  try {
    const result = await getDb().query.products.findMany({
      where: eq(products.isVerified, true),
      orderBy: [desc(products.createdAt)],
      limit,
    });
    return result;
  } catch (error) {
    console.error("Failed to get verified products:", error);
    return [];
  }
}

export async function searchProducts(query: string, limit: number = 50) {
  try {
    const result = await getDb().query.products.findMany({
      where: and(eq(products.isVerified, true), like(products.name, `%${query}%`)),
      orderBy: [desc(products.createdAt)],
      limit,
    });
    return result;
  } catch (error) {
    console.error("Failed to search products:", error);
    return [];
  }
}

// ============ Biodiversity Incidents ============

export async function createBiodiversityIncident(data: {
  incidentId: string;
  incidentType: string;
  species: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  severity: string;
  description: string;
  status?: string;
  reportCount?: number;
}) {
  try {
    const result = await getDb()
      .insert(biodiversityIncidents)
      .values({
        incidentId: data.incidentId,
        incidentType: data.incidentType,
        species: data.species,
        location: data.location,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        severity: data.severity,
        description: data.description,
        status: data.status || "active",
        reportCount: data.reportCount || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: biodiversityIncidents.id });

    return result[0]?.id;
  } catch (error) {
    console.error("Failed to create biodiversity incident:", error);
    throw error;
  }
}

export async function getActiveBiodiversityIncidents(limit: number = 100) {
  try {
    const result = await getDb().query.biodiversityIncidents.findMany({
      where: eq(biodiversityIncidents.status, "active"),
      orderBy: [desc(biodiversityIncidents.createdAt)],
      limit,
    });
    return result;
  } catch (error) {
    console.error("Failed to get active biodiversity incidents:", error);
    return [];
  }
}

export async function getActiveHotspotZones(limit: number = 50) {
  try {
    const result = await getDb().query.hotspotZones.findMany({
      where: eq(hotspotZones.isActive, true),
      orderBy: [desc(hotspotZones.createdAt)],
      limit,
    });
    return result;
  } catch (error) {
    console.error("Failed to get active hotspot zones:", error);
    return [];
  }
}

export async function getBiodiversityIncidentsBySpecies(species: string, limit: number = 50) {
  try {
    const result = await getDb().query.biodiversityIncidents.findMany({
      where: eq(biodiversityIncidents.species, species),
      orderBy: [desc(biodiversityIncidents.createdAt)],
      limit,
    });
    return result;
  } catch (error) {
    console.error("Failed to get biodiversity incidents by species:", error);
    return [];
  }
}

// ============ Community Contributions ============

export async function createCommunityContribution(data: {
  userId: string;
  contributionType: "report" | "observation" | "support" | "purchase";
  amount?: string | null;
  points: number;
  description?: string | null;
  relatedId?: string | null;
}) {
  try {
    const result = await getDb()
      .insert(communityContributions)
      .values({
        userId: data.userId,
        contributionType: data.contributionType,
        amount: data.amount || null,
        points: data.points,
        description: data.description || null,
        relatedId: data.relatedId || null,
        createdAt: new Date(),
      })
      .returning({ id: communityContributions.id });

    return result[0]?.id;
  } catch (error) {
    console.error("Failed to create community contribution:", error);
    throw error;
  }
}

export async function getUserContributions(userId: string, limit: number = 100) {
  try {
    const result = await getDb().query.communityContributions.findMany({
      where: eq(communityContributions.userId, userId),
      orderBy: [desc(communityContributions.createdAt)],
      limit,
    });
    return result;
  } catch (error) {
    console.error("Failed to get user contributions:", error);
    return [];
  }
}

export async function getUserTotalPoints(userId: string): Promise<number> {
  try {
    const result = await getDb().query.communityContributions.findMany({
      where: eq(communityContributions.userId, userId),
    });
    return result.reduce((sum, contrib) => sum + (contrib.points || 0), 0);
  } catch (error) {
    console.error("Failed to get user total points:", error);
    return 0;
  }
}

export async function getTopContributors(limit: number = 20) {
  try {
    const result = await getDb().query.communityContributions.findMany({
      orderBy: [desc(communityContributions.points)],
      limit,
    });

    // Group by userId and sum points
    const grouped = new Map<string, number>();
    result.forEach((contrib) => {
      const current = grouped.get(contrib.userId) || 0;
      grouped.set(contrib.userId, current + (contrib.points || 0));
    });

    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([userId, points]) => ({ userId, points }));
  } catch (error) {
    console.error("Failed to get top contributors:", error);
    return [];
  }
}

// ============ Impact Ledger ============

export async function recordImpact(data: {
  metricType:
    | "workers-protected"
    | "species-protected"
    | "forest-preserved"
    | "wages-improved"
    | "community-fund";
  value: any;
  unit: string;
  description?: string | null;
  relatedId?: string | null;
}) {
  try {
    const result = await getDb()
      .insert(impactLedger)
      .values({
        metricType: data.metricType,
        value: data.value,
        unit: data.unit,
        description: data.description || null,
        relatedId: data.relatedId || null,
        createdAt: new Date(),
      })
      .returning({ id: impactLedger.id });

    return result[0]?.id;
  } catch (error) {
    console.error("Failed to record impact:", error);
    throw error;
  }
}

export async function getImpactMetrics(limit: number = 200) {
  try {
    const result = await getDb().query.impactLedger.findMany({
      orderBy: [desc(impactLedger.createdAt)],
      limit,
    });
    return result;
  } catch (error) {
    console.error("Failed to get impact metrics:", error);
    return [];
  }
}

export async function getImpactByType(
  metricType:
    | "workers-protected"
    | "species-protected"
    | "forest-preserved"
    | "wages-improved"
    | "community-fund",
  limit: number = 100,
) {
  try {
    const result = await getDb().query.impactLedger.findMany({
      where: eq(impactLedger.metricType, metricType),
      orderBy: [desc(impactLedger.createdAt)],
      limit,
    });
    return result;
  } catch (error) {
    console.error("Failed to get impact by type:", error);
    return [];
  }
}

export async function getImpactSummary() {
  try {
    const metrics = await getDb().query.impactLedger.findMany();

    const summary = {
      workersProtected: 0,
      speciesProtected: 0,
      forestPreserved: 0,
      wagesImproved: 0,
      communityFund: 0,
    };

    metrics.forEach((metric) => {
      const value = parseFloat(metric.value) || 0;
      switch (metric.metricType) {
        case "workers-protected":
          summary.workersProtected += value;
          break;
        case "species-protected":
          summary.speciesProtected += value;
          break;
        case "forest-preserved":
          summary.forestPreserved += value;
          break;
        case "wages-improved":
          summary.wagesImproved += value;
          break;
        case "community-fund":
          summary.communityFund += value;
          break;
      }
    });

    return summary;
  } catch (error) {
    console.error("Failed to get impact summary:", error);
    return {
      workersProtected: 0,
      speciesProtected: 0,
      forestPreserved: 0,
      wagesImproved: 0,
      communityFund: 0,
    };
  }
}
