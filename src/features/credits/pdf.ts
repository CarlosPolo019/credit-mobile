import { Linking } from "react-native";
import { config } from "@/shared/config/env";

/**
 * Opens the server-rendered credit PDF (GET /credits/{id}/pdf) directly in
 * the system browser instead of downloading it into the app and handing it
 * to the share sheet — that download+share path (react-native-blob-util +
 * react-native-share) was unreliable on real devices ("Download
 * Interrupted" depending on which app the user picked). The browser has its
 * own PDF viewer and just needs the URL.
 *
 * A regular browser tab can't attach an Authorization header, so the token
 * travels as a query param instead — the backend's JwtAuthenticationFilter
 * accepts that only for this one route. Content-Disposition on the backend
 * is `inline`, so the browser renders it instead of forcing a download.
 */
export function creditPdfUrl(creditId: string, token: string) {
  return `${config.apiBaseUrl}/api/v1/credits/${creditId}/pdf?token=${encodeURIComponent(token)}`;
}

export async function openCreditPdf(creditId: string, token: string | null) {
  if (!token) {
    throw new Error("No hay sesión activa.");
  }
  await Linking.openURL(creditPdfUrl(creditId, token));
}
