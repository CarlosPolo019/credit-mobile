import type { Session } from "@/entities/session/types";
import { api } from "@/shared/api/client";

export async function loginRequest(username: string, password: string) {
  const response = await api.post("/api/v1/auth/login", { username, password });
  return response.data as Session;
}

export async function registerRequest(fullName: string, document: string, password: string) {
  const response = await api.post("/api/v1/auth/register", { fullName, document, password });
  return response.data as Session;
}
