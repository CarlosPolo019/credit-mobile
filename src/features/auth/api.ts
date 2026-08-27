import type { Session } from "@/entities/session/types";
import { api } from "@/shared/api/client";

export type LoginPayload = {
  username: string;
  password: string;
};

export async function loginRequest(username: string, password: string) {
  const payload: LoginPayload = { username, password };
  const response = await api.post("/api/v1/auth/login", payload);
  return response.data as Session;
}
