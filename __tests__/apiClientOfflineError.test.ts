import { api } from "@/shared/api/client";

function rejectedHandler() {
  const handler = api.interceptors.response.handlers?.[0]?.rejected;
  if (!handler) throw new Error("response error interceptor not registered");
  return handler;
}

describe("api client offline error translation", () => {
  it("translates a network error with no response into the offline message", async () => {
    const networkError = { message: "Network Error", code: "ERR_NETWORK" };

    await expect(rejectedHandler()(networkError)).rejects.toThrow("Sin conexión. Revisa internet e intenta de nuevo.");
  });

  it("translates a timeout error with no response into the offline message", async () => {
    const timeoutError = { message: "timeout of 15000ms exceeded", code: "ECONNABORTED" };

    await expect(rejectedHandler()(timeoutError)).rejects.toThrow("Sin conexión. Revisa internet e intenta de nuevo.");
  });

  it("keeps the backend message when a response is present", async () => {
    const httpError = { response: { status: 400, data: { message: "Documento inválido." } } };

    await expect(rejectedHandler()(httpError)).rejects.toThrow("Documento inválido.");
  });
});
