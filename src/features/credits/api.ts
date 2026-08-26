import type { CreditFilters, CreditListResponse, CreditPayload } from "@/entities/credit/types";
import { normalizeDirection, normalizeSort } from "@/entities/credit/validation";
import { api } from "@/shared/api/client";

export async function createCredit(payload: CreditPayload) {
  const response = await api.post("/api/v1/credits", payload);
  return response.data;
}

export async function listCredits(filters: CreditFilters) {
  const response = await api.get("/api/v1/credits", {
    params: {
      clientName: filters.clientName || undefined,
      clientDocument: filters.clientDocument || undefined,
      salesperson: filters.salesperson || undefined,
      sortBy: normalizeSort(filters.sortBy),
      direction: normalizeDirection(filters.direction),
    },
  });
  return response.data as CreditListResponse;
}
