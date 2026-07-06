import { db } from "./db";
import {
  workerReports,
  products,
  biodiversityIncidents,
  hotspotZones,
  communityContributions,
  impactLedger,
} from "@/drizzle/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Worker Reports Queries
export async function createWorkerReportDB(data: {
  reportId: string;
  incidentType: string;
  description: string;
  location: string;
  escalationPath: string;
  status: string;
  severity: string;
}) {
  try {
    const result = await db.insert(workerReports).values(data).returning({ id: workerReports.id });
    return result[0]?.id;
  } catch (error) {
    console.error("Failed to create worker report:", error);
    throw error;
  }
}

export async function getWorkerReportDB(reportId: string) {
  try {
    const result = await db.query.workerReports.findFirst({
      where: eq(workerReports.reportId, reportId),
    });
    return result;
  } catch (error) {
    console.error("Failed to get worker report:", error);
    return null;
  }
}

export async function updateWorkerReportStatusDB(reportId: string, status: string) {
  try {
    await db.update(workerReports).set({ status }).where(eq(workerReports.reportId, reportId));
  } catch (error) {
    console.error("Failed to update worker report status:", error);
    throw error;
  }
}

export async function getUserWorkerReportsDB(userId: string | null) {
  try {
    if (!userId) return [];
    const result = await db.query.workerReports.findMany({
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

// Products Queries
export async function getProductDB(productId: string) {
  try {
    const result = await db.query.products.findFirst({
      where: eq(products.productId, productId),
    });
    return result;
  } catch (error) {
    console.error("Failed to get product:", error);
    return null;
  }
}

export async function getVerifiedProductsDB() {
  try {
    const result = await db.query.products.findMany({
      where: eq(products.isVerified, true),
      orderBy: [desc(products.createdAt)],
      limit: 100,
    });
    return result;
  } catch (error) {
    console.error("Failed to get verified products:", error);
    return [];
  }
}

// Biodiversity Incidents Queries
export async function createBiodiversityIncidentDB(data: {
  incidentId: string;
  incidentType: string;
  species: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  severity: string;
  description: string;
  status: string;
  reportCount: number;
}) {
  try {
    const result = await db
      .insert(biodiversityIncidents)
      .values(data)
      .returning({ id: biodiversityIncidents.id });
    return result[0]?.id;
  } catch (error) {
    console.error("Failed to create biodiversity incident:", error);
    throw error;
  }
}

export async function getActiveBiodiversityIncidentsDB() {
  try {
    const result = await db.query.biodiversityIncidents.findMany({
      where: eq(biodiversityIncidents.status, "active"),
      orderBy: [desc(biodiversityIncidents.createdAt)],
      limit: 100,
    });
    return result;
  } catch (error) {
    console.error("Failed to get active biodiversity incidents:", error);
    return [];
  }
}

export async function getActiveHotspotZonesDB() {
  try {
    const result = await db.query.hotspotZones.findMany({
      where: eq(hotspotZones.isActive, true),
      orderBy: [desc(hotspotZones.createdAt)],
      limit: 50,
    });
    return result;
  } catch (error) {
    console.error("Failed to get active hotspot zones:", error);
    return [];
  }
}

export async function getBiodiversityIncidentsBySpeciesDB(species: string) {
  try {
    const result = await db.query.biodiversityIncidents.findMany({
      where: eq(biodiversityIncidents.species, species),
      orderBy: [desc(biodiversityIncidents.createdAt)],
      limit: 50,
    });
    return result;
  } catch (error) {
    console.error("Failed to get biodiversity incidents by species:", error);
    return [];
  }
}

// Community Contributions Queries
export async function createCommunityContributionDB(data: {
  userId: string;
  contributionType: string;
  amount?: string | null;
  points: number;
  description?: string | null;
  relatedId?: string | null;
}) {
  try {
    const result = await db
      .insert(communityContributions)
      .values(data)
      .returning({ id: communityContributions.id });
    return result[0]?.id;
  } catch (error) {
    console.error("Failed to create community contribution:", error);
    throw error;
  }
}

export async function getUserContributionsDB(userId: string) {
  try {
    const result = await db.query.communityContributions.findMany({
      where: eq(communityContributions.userId, userId),
      orderBy: [desc(communityContributions.createdAt)],
      limit: 100,
    });
    return result;
  } catch (error) {
    console.error("Failed to get user contributions:", error);
    return [];
  }
}

export async function getUserTotalPointsDB(userId: string): Promise<number> {
  try {
    const result = await db.query.communityContributions.findMany({
      where: eq(communityContributions.userId, userId),
    });
    return result.reduce((sum, contrib) => sum + (contrib.points || 0), 0);
  } catch (error) {
    console.error("Failed to get user total points:", error);
    return 0;
  }
}

// Impact Ledger Queries
export async function recordImpactDB(data: {
  metricType: string;
  value: any;
  unit: string;
  description?: string | null;
  relatedId?: string | null;
}) {
  try {
    const result = await db.insert(impactLedger).values(data).returning({ id: impactLedger.id });
    return result[0]?.id;
  } catch (error) {
    console.error("Failed to record impact:", error);
    throw error;
  }
}

export async function getImpactMetricsDB() {
  try {
    const result = await db.query.impactLedger.findMany({
      orderBy: [desc(impactLedger.createdAt)],
      limit: 200,
    });
    return result;
  } catch (error) {
    console.error("Failed to get impact metrics:", error);
    return [];
  }
}

export async function getImpactByTypeDB(metricType: string) {
  try {
    const result = await db.query.impactLedger.findMany({
      where: eq(impactLedger.metricType, metricType),
      orderBy: [desc(impactLedger.createdAt)],
      limit: 100,
    });
    return result;
  } catch (error) {
    console.error("Failed to get impact by type:", error);
    return [];
  }
}
