import axios from "axios";
import { config } from "../config/env.js";

let getToken = () => null;
let onUnauthorized = () => {};

export function configureApi(options) {
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
    const message = error.response?.data?.message ?? "No se pudo completar la solicitud.";
    return Promise.reject(new Error(message));
  },
);
