import { normalizeDirection, normalizeSort } from "../../entities/credit/validation.js";
import { api } from "../../shared/api/client.js";

export async function createCredit(payload) {
  const response = await api.post("/api/v1/credits", payload);
  return response.data;
}

export async function listCredits(filters) {
  const response = await api.get("/api/v1/credits", {
    params: {
      clientName: filters.clientName || undefined,
      clientDocument: filters.clientDocument || undefined,
      salesperson: filters.salesperson || undefined,
      sortBy: normalizeSort(filters.sortBy),
      direction: normalizeDirection(filters.direction),
    },
  });
  return response.data;
}
