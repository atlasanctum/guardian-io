import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

export interface AuditLogEntry {
  id?: number;
  adminId: string;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId: string | number;
  changes: Record<string, any>;
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
  status: "success" | "failure";
  errorMessage?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export class AuditLogger {
  private db: any;

  constructor(database: any) {
    this.db = database;
  }

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await this.db.insert(sql.raw("audit_logs")).values({
        adminId: entry.adminId,
        adminEmail: entry.adminEmail,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        changes: JSON.stringify(entry.changes),
        previousValues: JSON.stringify(entry.previousValues),
        newValues: JSON.stringify(entry.newValues),
        status: entry.status,
        errorMessage: entry.errorMessage,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        timestamp: entry.timestamp,
      });
    } catch (error) {
      console.error("Failed to log audit entry:", error);
    }
  }

  async logReportApproval(
    adminId: string,
    adminEmail: string,
    reportId: number,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    await this.log({
      adminId,
      adminEmail,
      action: "APPROVE_REPORT",
      resourceType: "worker_report",
      resourceId: reportId,
      changes: { status: "escalated" },
      previousValues: { status: "submitted" },
      newValues: { status: "escalated" },
      status: "success",
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  }

  async logReportDismissal(
    adminId: string,
    adminEmail: string,
    reportId: number,
    reason: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    await this.log({
      adminId,
      adminEmail,
      action: "DISMISS_REPORT",
      resourceType: "worker_report",
      resourceId: reportId,
      changes: { status: "dismissed", dismissalReason: reason },
      previousValues: { status: "submitted" },
      newValues: { status: "dismissed", dismissalReason: reason },
      status: "success",
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  }

  async logReportStatusChange(
    adminId: string,
    adminEmail: string,
    reportId: number,
    previousStatus: string,
    newStatus: string,
    notes: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    await this.log({
      adminId,
      adminEmail,
      action: "UPDATE_REPORT_STATUS",
      resourceType: "worker_report",
      resourceId: reportId,
      changes: { status: newStatus, notes },
      previousValues: { status: previousStatus },
      newValues: { status: newStatus, notes },
      status: "success",
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  }

  async logIncidentStatusChange(
    adminId: string,
    adminEmail: string,
    incidentId: number,
    previousStatus: string,
    newStatus: string,
    notes: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    await this.log({
      adminId,
      adminEmail,
      action: "UPDATE_INCIDENT_STATUS",
      resourceType: "biodiversity_incident",
      resourceId: incidentId,
      changes: { status: newStatus, investigationNotes: notes },
      previousValues: { status: previousStatus },
      newValues: { status: newStatus, investigationNotes: notes },
      status: "success",
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  }

  async logUserSuspension(
    adminId: string,
    adminEmail: string,
    userId: string,
    reason: string,
    duration: number,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    await this.log({
      adminId,
      adminEmail,
      action: "SUSPEND_USER",
      resourceType: "user",
      resourceId: userId,
      changes: { status: "suspended", suspensionReason: reason, duration },
      previousValues: { status: "active" },
      newValues: { status: "suspended", suspensionReason: reason, duration },
      status: "success",
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  }

  async logUserBan(
    adminId: string,
    adminEmail: string,
    userId: string,
    reason: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    await this.log({
      adminId,
      adminEmail,
      action: "BAN_USER",
      resourceType: "user",
      resourceId: userId,
      changes: { status: "banned", banReason: reason },
      previousValues: { status: "active" },
      newValues: { status: "banned", banReason: reason },
      status: "success",
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  }

  async logConfigurationChange(
    adminId: string,
    adminEmail: string,
    configKey: string,
    previousValue: any,
    newValue: any,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    await this.log({
      adminId,
      adminEmail,
      action: "UPDATE_CONFIGURATION",
      resourceType: "system_config",
      resourceId: configKey,
      changes: { [configKey]: newValue },
      previousValues: { [configKey]: previousValue },
      newValues: { [configKey]: newValue },
      status: "success",
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  }

  async getAuditLogs(
    filters?: {
      adminId?: string;
      action?: string;
      resourceType?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ): Promise<AuditLogEntry[]> {
    try {
      let query = this.db.select().from(sql.raw("audit_logs"));

      if (filters?.adminId) {
        query = query.where(sql`adminId = ${filters.adminId}`);
      }
      if (filters?.action) {
        query = query.where(sql`action = ${filters.action}`);
      }
      if (filters?.resourceType) {
        query = query.where(sql`resourceType = ${filters.resourceType}`);
      }
      if (filters?.status) {
        query = query.where(sql`status = ${filters.status}`);
      }
      if (filters?.startDate) {
        query = query.where(sql`timestamp >= ${filters.startDate}`);
      }
      if (filters?.endDate) {
        query = query.where(sql`timestamp <= ${filters.endDate}`);
      }

      query = query.orderBy(sql`timestamp DESC`);

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.offset(filters.offset);
      }

      return await query;
    } catch (error) {
      console.error("Failed to retrieve audit logs:", error);
      return [];
    }
  }

  async getAdminActivitySummary(
    adminId: string,
    days: number = 30,
  ): Promise<Record<string, number>> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const logs = await this.getAuditLogs({
        adminId,
        startDate,
      });

      const summary: Record<string, number> = {};
      logs.forEach((log) => {
        summary[log.action] = (summary[log.action] || 0) + 1;
      });

      return summary;
    } catch (error) {
      console.error("Failed to get activity summary:", error);
      return {};
    }
  }

  async getSuspiciousActivity(threshold: number = 10): Promise<AuditLogEntry[]> {
    try {
      const logs = await this.getAuditLogs({
        status: "failure",
        limit: 1000,
      });

      // Group by admin
      const adminFailures: Record<string, number> = {};
      logs.forEach((log) => {
        adminFailures[log.adminId] = (adminFailures[log.adminId] || 0) + 1;
      });

      // Find suspicious admins
      const suspiciousAdmins = Object.keys(adminFailures).filter(
        (adminId) => adminFailures[adminId] >= threshold,
      );

      // Return logs from suspicious admins
      return logs.filter((log) => suspiciousAdmins.includes(log.adminId));
    } catch (error) {
      console.error("Failed to detect suspicious activity:", error);
      return [];
    }
  }
}

let auditLogger: AuditLogger | null = null;

export function initializeAuditLogger(database: any): AuditLogger {
  if (!auditLogger) {
    auditLogger = new AuditLogger(database);
  }
  return auditLogger;
}

export function getAuditLogger(): AuditLogger {
  if (!auditLogger) {
    throw new Error("Audit logger not initialized. Call initializeAuditLogger() first.");
  }
  return auditLogger;
}
