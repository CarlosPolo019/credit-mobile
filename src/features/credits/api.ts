import type { Credit, CreditAuditEntry, CreditEstimate, CreditFilters, CreditListResponse, CreditPayload } from "@/entities/credit/types";
import { normalizeDirection, normalizeSort } from "@/entities/credit/validation";
import { api } from "@/shared/api/client";

export async function createCredit(payload: CreditPayload) {
  const response = await api.post("/api/v1/credits", payload);
  return response.data;
}

/**
 * Estimated monthly installment/total payoff, computed by the backend
 * (same formula it uses for Credit.estimatedMonthlyPayment/estimatedTotalToPay
 * and the PDF export) without saving anything — used for the pre-submission
 * confirmation sheet, matching credit-web instead of recomputing locally.
 */
export async function estimateCredit(payload: Pick<CreditPayload, "amount" | "interestRate" | "termMonths">) {
  const response = await api.post("/api/v1/credits/estimate", payload);
  return response.data as CreditEstimate;
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

export async function getCredit(id: string) {
  const response = await api.get(`/api/v1/credits/${id}`);
  return response.data as Credit;
}

export async function updateCredit(id: string, payload: CreditPayload) {
  const response = await api.put(`/api/v1/credits/${id}`, payload);
  return response.data as Credit;
}

export async function deleteCredit(id: string) {
  await api.delete(`/api/v1/credits/${id}`);
}

export async function getCreditAudit(id: string) {
  const response = await api.get(`/api/v1/credits/${id}/audit`);
  return response.data as CreditAuditEntry[];
}
