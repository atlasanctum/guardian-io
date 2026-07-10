export interface SearchFilters {
  query?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  severity?: "low" | "medium" | "high" | "critical";
  location?: string;
  type?: string;
  status?: string;
  sortBy?: "relevance" | "date" | "severity" | "popularity";
  sortOrder?: "asc" | "desc";
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export class SearchFilterEngine {
  /**
   * Full-text search across multiple fields
   */
  static searchText<T extends Record<string, any>>(
    items: T[],
    query: string,
    searchFields: (keyof T)[],
  ): T[] {
    if (!query || query.trim().length === 0) {
      return items;
    }

    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/).filter((w) => w.length > 0);

    return items.filter((item) => {
      return words.some((word) => {
        return searchFields.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) return false;

          const stringValue = String(value).toLowerCase();
          return stringValue.includes(word);
        });
      });
    });
  }

  /**
   * Filter by date range
   */
  static filterByDateRange<T extends { createdAt?: Date | string | number }>(
    items: T[],
    startDate?: Date,
    endDate?: Date,
  ): T[] {
    if (!startDate && !endDate) {
      return items;
    }

    return items.filter((item) => {
      if (!item.createdAt) return false;

      const itemDate = new Date(item.createdAt);

      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;

      return true;
    });
  }

  /**
   * Filter by severity level
   */
  static filterBySeverity<T extends { severity?: string }>(
    items: T[],
    severity: "low" | "medium" | "high" | "critical",
  ): T[] {
    const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
    const minSeverity = severityOrder[severity];

    return items.filter((item) => {
      if (!item.severity) return false;
      return severityOrder[item.severity as keyof typeof severityOrder] >= minSeverity;
    });
  }

  /**
   * Filter by location (supports partial matching)
   */
  static filterByLocation<T extends { location?: string }>(
    items: T[],
    location: string,
  ): T[] {
    if (!location || location.trim().length === 0) {
      return items;
    }

    const lowerLocation = location.toLowerCase();

    return items.filter((item) => {
      if (!item.location) return false;
      return item.location.toLowerCase().includes(lowerLocation);
    });
  }

  /**
   * Filter by type
   */
  static filterByType<T extends { type?: string }>(items: T[], type: string): T[] {
    if (!type) {
      return items;
    }

    return items.filter((item) => item.type === type);
  }

  /**
   * Filter by status
   */
  static filterByStatus<T extends { status?: string }>(items: T[], status: string): T[] {
    if (!status) {
      return items;
    }

    return items.filter((item) => item.status === status);
  }

  /**
   * Sort items
   */
  static sort<T extends Record<string, any>>(
    items: T[],
    sortBy: "relevance" | "date" | "severity" | "popularity" = "date",
    sortOrder: "asc" | "desc" = "desc",
  ): T[] {
    const sorted = [...items];

    const multiplier = sortOrder === "asc" ? 1 : -1;

    switch (sortBy) {
      case "date":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return (dateB - dateA) * multiplier;
        });
        break;

      case "severity":
        const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        sorted.sort((a, b) => {
          const sevA = severityOrder[a.severity as keyof typeof severityOrder] || 0;
          const sevB = severityOrder[b.severity as keyof typeof severityOrder] || 0;
          return (sevB - sevA) * multiplier;
        });
        break;

      case "popularity":
        sorted.sort((a, b) => {
          const popA = a.reportCount || a.views || 0;
          const popB = b.reportCount || b.views || 0;
          return (popB - popA) * multiplier;
        });
        break;

      case "relevance":
      default:
        // Relevance sorting would require scoring based on search query
        break;
    }

    return sorted;
  }

  /**
   * Paginate results
   */
  static paginate<T>(items: T[], page: number = 1, pageSize: number = 20): SearchResult<T> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      items: items.slice(startIndex, endIndex),
      total: items.length,
      page,
      pageSize,
      hasMore: endIndex < items.length,
    };
  }

  /**
   * Apply all filters and search
   */
  static search<T extends Record<string, any>>(
    items: T[],
    filters: SearchFilters,
    searchFields: (keyof T)[],
  ): SearchResult<T> {
    let results = [...items];

    // Apply text search
    if (filters.query) {
      results = this.searchText(results, filters.query, searchFields);
    }

    // Apply date range filter
    if (filters.dateRange) {
      results = this.filterByDateRange(results, filters.dateRange.start, filters.dateRange.end);
    }

    // Apply severity filter
    if (filters.severity) {
      results = this.filterBySeverity(results, filters.severity);
    }

    // Apply location filter
    if (filters.location) {
      results = this.filterByLocation(results, filters.location);
    }

    // Apply type filter
    if (filters.type) {
      results = this.filterByType(results, filters.type);
    }

    // Apply status filter
    if (filters.status) {
      results = this.filterByStatus(results, filters.status);
    }

    // Apply sorting
    results = this.sort(results, filters.sortBy, filters.sortOrder);

    // Apply pagination
    const page = 1;
    const pageSize = 20;
    return this.paginate(results, page, pageSize);
  }
}

// React Hook for search and filtering
import { useState, useCallback, useMemo } from "react";

export function useSearch<T extends Record<string, any>>(
  items: T[],
  searchFields: (keyof T)[],
) {
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: "date",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    const searchResults = SearchFilterEngine.search(items, filters, searchFields);
    return SearchFilterEngine.paginate(searchResults.items, page, 20);
  }, [items, filters, page, searchFields]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ sortBy: "date", sortOrder: "desc" });
    setPage(1);
  }, []);

  const nextPage = useCallback(() => {
    if (results.hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [results.hasMore]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  return {
    results: results.items,
    total: results.total,
    page,
    pageSize: results.pageSize,
    hasMore: results.hasMore,
    filters,
    updateFilters,
    clearFilters,
    nextPage,
    previousPage,
    setPage,
  };
}
