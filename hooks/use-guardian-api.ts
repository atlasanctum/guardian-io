import { trpc } from "@/lib/trpc";
import { useState } from "react";

// Hook for worker report submission
export function useWorkerReportSubmission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (data: {
    incidentType: string;
    description: string;
    location: string;
    escalationPath: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await trpc.workerReports.create.mutateAsync({
        incidentType: data.incidentType as any,
        description: data.description,
        location: data.location,
        escalationPath: data.escalationPath as any,
      });

      setIsLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to submit report";
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  return { submitReport, isLoading, error };
}

// Hook for tracking reports
export function useReportTracking(reportId: string) {
  const { data: report, isLoading } = trpc.workerReports.getById.useQuery(
    { reportId },
    { enabled: !!reportId },
  );

  return { report, isLoading };
}

// Hook for biodiversity incidents
export function useBiodiversityIncidents() {
  const { data: incidents, isLoading } = trpc.biodiversityIncidents.getActive.useQuery();

  return { incidents: incidents || [], isLoading };
}

// Hook for product lookup
export function useProductLookup(productId: string) {
  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { productId },
    { enabled: !!productId },
  );

  return { product, isLoading };
}

// Hook for user contributions
export function useUserContributions() {
  const { data: contributions, isLoading } = trpc.contributions.getUserContributions.useQuery();

  return { contributions: contributions || [], isLoading };
}

// Hook for user points
export function useUserPoints() {
  const { data: pointsData, isLoading } = trpc.contributions.getUserPoints.useQuery();

  return { totalPoints: pointsData?.totalPoints || 0, isLoading };
}

// Hook for impact metrics
export function useImpactMetrics() {
  const { data: metrics, isLoading } = trpc.impact.getMetrics.useQuery();

  return { metrics: metrics || [], isLoading };
}

// Hook for submitting biodiversity incident
export function useBiodiversityIncidentSubmission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitIncident = async (data: {
    incidentType: string;
    species: string;
    location: string;
    latitude?: number;
    longitude?: number;
    severity: string;
    description: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await trpc.biodiversityIncidents.create.mutateAsync({
        incidentType: data.incidentType as any,
        species: data.species,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        severity: data.severity as any,
        description: data.description,
      });

      setIsLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to submit incident";
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  return { submitIncident, isLoading, error };
}

// Hook for recording contributions
export function useRecordContribution() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordContribution = async (data: {
    contributionType: string;
    amount?: string;
    points?: number;
    description?: string;
    relatedId?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await trpc.contributions.create.mutateAsync({
        contributionType: data.contributionType as any,
        amount: data.amount,
        points: data.points || 0,
        description: data.description,
        relatedId: data.relatedId,
      });

      setIsLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to record contribution";
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  return { recordContribution, isLoading, error };
}
