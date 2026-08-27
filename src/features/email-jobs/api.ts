import type { EmailJobFilters, EmailJobListResponse } from "@/entities/email-job/types";
import { api } from "@/shared/api/client";

/**
 * Admin-only on the backend (SecurityConfig.hasRole("ADMIN")) — a non-ADMIN
 * token gets a 403 here, same as credit-web. The screen that calls this
 * also gates itself by role so a non-admin never gets this far.
 */
export async function listEmailJobs(filters: EmailJobFilters) {
  const response = await api.get("/api/v1/email-jobs", {
    params: {
      status: filters.status || undefined,
      search: filters.search || undefined,
      sortBy: filters.sortBy,
      direction: filters.direction,
    },
  });
  return response.data as EmailJobListResponse;
}
