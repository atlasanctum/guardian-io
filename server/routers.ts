import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import * as db from "./db";

// Validation schemas
const workerReportSchema = z.object({
  incidentType: z.enum(["harassment", "wage-theft", "unsafe-conditions", "trafficking", "other"]),
  description: z.string().min(10).max(1000),
  location: z.string().min(1).max(255),
  escalationPath: z.enum(["ngo", "government", "internal", "anonymous"]),
});

const biodiversityIncidentSchema = z.object({
  incidentType: z.enum(["poaching", "habitat-loss", "trafficking", "sighting"]),
  species: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  description: z.string().min(10).max(1000),
});

const contributionSchema = z.object({
  contributionType: z.enum(["report", "observation", "support", "purchase"]),
  amount: z.string().optional(),
  points: z.number().default(0),
  description: z.string().optional(),
  relatedId: z.string().optional(),
});

export const appRouter = router({
  // Health check
  health: publicProcedure.query(() => ({ status: "ok", service: "guardian-io" })),

  // Worker Reports
  workerReports: router({
    // Create a new report
    create: publicProcedure
      .input(workerReportSchema)
      .mutation(async ({ input }) => {
        try {
          const reportId = `#${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
          const id = await db.createWorkerReport({
            reportId,
            incidentType: input.incidentType,
            description: input.description,
            location: input.location,
            escalationPath: input.escalationPath,
            status: "submitted",
            severity: "medium",
          });

          return {
            success: true,
            reportId,
            id,
            message: "Report submitted successfully",
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to create report",
          };
        }
      }),

    // Get report by ID
    getById: publicProcedure
      .input(z.object({ reportId: z.string() }))
      .query(async ({ input }) => {
        const report = await db.getWorkerReport(input.reportId);
        return report || { error: "Report not found" };
      }),

    // Get user's reports (protected)
    getUserReports: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserWorkerReports(ctx.user?.id || null);
    }),

    // Update report status (protected)
    updateStatus: protectedProcedure
      .input(
        z.object({
          reportId: z.string(),
          status: z.enum(["submitted", "under-review", "escalated", "resolved"]),
        }),
      )
      .mutation(async ({ input }) => {
        try {
          await db.updateWorkerReportStatus(input.reportId, input.status);
          return { success: true };
        } catch (error) {
          return { success: false, error: "Failed to update status" };
        }
      }),
  }),

  // Products
  products: router({
    // Get product by QR code ID
    getById: publicProcedure
      .input(z.object({ productId: z.string() }))
      .query(async ({ input }) => {
        const product = await db.getProduct(input.productId);
        return product || { error: "Product not found" };
      }),

    // Get all verified products
    getVerified: publicProcedure.query(async () => {
      return db.getVerifiedProducts();
    }),
  }),

  // Biodiversity Incidents
  biodiversityIncidents: router({
    // Create a new incident
    create: publicProcedure
      .input(biodiversityIncidentSchema)
      .mutation(async ({ input }) => {
        try {
          const incidentId = `INC-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
          const id = await db.createBiodiversityIncident({
            incidentId,
            incidentType: input.incidentType,
            species: input.species,
            location: input.location,
            latitude: input.latitude as any,
            longitude: input.longitude as any,
            severity: input.severity,
            description: input.description,
            status: "active",
            reportCount: 1,
          });

          return {
            success: true,
            incidentId,
            id,
            message: "Incident reported successfully",
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to create incident",
          };
        }
      }),

    // Get active incidents
    getActive: publicProcedure.query(async () => {
      return db.getActiveBiodiversityIncidents();
    }),

    // Get hotspot zones
    getHotspots: publicProcedure.query(async () => {
      return db.getActiveHotspotZones();
    }),

    // Get incidents by species
    getBySpecies: publicProcedure
      .input(z.object({ species: z.string() }))
      .query(async ({ input }) => {
        return db.getBiodiversityIncidentsBySpecies(input.species);
      }),
  }),

  // Community Contributions
  contributions: router({
    // Record a contribution
    create: protectedProcedure
      .input(contributionSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          const id = await db.createCommunityContribution({
            userId: ctx.user.id,
            contributionType: input.contributionType,
            amount: input.amount as any,
            points: input.points,
            description: input.description,
            relatedId: input.relatedId,
          });

          return {
            success: true,
            id,
            message: "Contribution recorded successfully",
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to record contribution",
          };
        }
      }),

    // Get user's contributions
    getUserContributions: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserContributions(ctx.user.id);
    }),

    // Get user's total points
    getUserPoints: protectedProcedure.query(async ({ ctx }) => {
      const points = await db.getUserTotalPoints(ctx.user.id);
      return { userId: ctx.user.id, totalPoints: points };
    }),
  }),

  // Impact Metrics
  impact: router({
    // Get all impact metrics
    getMetrics: publicProcedure.query(async () => {
      return db.getImpactMetrics();
    }),

    // Get impact by type
    getByType: publicProcedure
      .input(
        z.object({
          metricType: z.enum([
            "workers-protected",
            "species-protected",
            "forest-preserved",
            "wages-improved",
            "community-fund",
          ]),
        }),
      )
      .query(async ({ input }) => {
        return db.getImpactByType(input.metricType);
      }),

    // Record impact (protected)
    record: protectedProcedure
      .input(
        z.object({
          metricType: z.enum([
            "workers-protected",
            "species-protected",
            "forest-preserved",
            "wages-improved",
            "community-fund",
          ]),
          value: z.string(),
          unit: z.string(),
          description: z.string().optional(),
          relatedId: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        try {
          const id = await db.recordImpact({
            metricType: input.metricType,
            value: input.value as any,
            unit: input.unit,
            description: input.description,
            relatedId: input.relatedId,
          });

          return {
            success: true,
            id,
            message: "Impact recorded successfully",
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to record impact",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
