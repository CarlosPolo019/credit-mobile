import ReactNativeBlobUtil from "react-native-blob-util";
import Share from "react-native-share";
import { config } from "@/shared/config/env";

/**
 * Downloads the server-rendered credit PDF (GET /credits/{id}/pdf) and hands
 * it to the share sheet. Uses react-native-blob-util directly instead of the
 * shared axios client: a plain <a href> / Linking.openURL can't carry the
 * Bearer token, and the PDF is a binary file, not JSON.
 */
export async function downloadAndShareCreditPdf(creditId: string, token: string | null) {
  if (!token) {
    throw new Error("No hay sesión activa.");
  }
  const path = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/credito-${creditId}.pdf`;
  const response = await ReactNativeBlobUtil.config({ path, fileCache: true, overwrite: true }).fetch(
    "GET",
    `${config.apiBaseUrl}/api/v1/credits/${creditId}/pdf`,
    { Authorization: `Bearer ${token}` },
  );

  if (response.respInfo.status < 200 || response.respInfo.status >= 300) {
    throw new Error("No se pudo descargar el PDF del crédito.");
  }

  await Share.open({
    url: `file://${response.path()}`,
    type: "application/pdf",
    failOnCancel: false,
  });
}
