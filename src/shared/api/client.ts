import axios from "axios";
import { config } from "@/shared/config/env";

type ApiOptions = {
  getToken?: () => string | null;
  onUnauthorized?: () => void;
};

let getToken: () => string | null = () => null;
let onUnauthorized: () => void = () => {};

export function configureApi(options: ApiOptions) {
  getToken = options.getToken ?? getToken;
  onUnauthorized = options.onUnauthorized ?? onUnauthorized;
}

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
});

api.interceptors.request.use((request) => {
  const token = getToken();
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized();
    }
    if (!error.response) {
      return Promise.reject(new Error("Sin conexión. Revisa internet e intenta de nuevo."));
    }
    const message = error.response?.data?.message ?? "No se pudo completar la solicitud.";
    return Promise.reject(new Error(message));
  },
);
