import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CreditPayload } from "@/entities/credit/types";
import {
  countPendingAndFailed,
  enqueueCredit,
  listQueuedCredits,
  markQueuedCreditFailed,
  removeQueuedCredit,
} from "@/features/credits/offlineQueue";

const payload: CreditPayload = {
  clientFirstName: "Pepito",
  clientSecondName: "",
  clientFirstSurname: "Perez",
  clientSecondSurname: "",
  clientDocument: "100000001",
  amount: 7800000,
  interestRate: 2,
  termMonths: 10,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("offline credit queue", () => {
  it("enqueues and lists credits", async () => {
    const item = await enqueueCredit(payload);

    const queue = await listQueuedCredits();
    expect(queue).toHaveLength(1);
    expect(queue[0].id).toBe(item.id);
    expect(queue[0].payload).toEqual(payload);
    expect(queue[0].status).toBe("pending");
    expect(queue[0].attempts).toBe(0);
  });

  it("counts pending and failed separately", async () => {
    const first = await enqueueCredit(payload);
    await enqueueCredit(payload);
    await markQueuedCreditFailed(first.id, "Sin conexión. Revisa internet e intenta de nuevo.");

    const counts = await countPendingAndFailed();
    expect(counts).toEqual({ pending: 1, failed: 1 });
  });

  it("marks a credit as failed with the sanitized error and bumps attempts", async () => {
    const item = await enqueueCredit(payload);

    await markQueuedCreditFailed(item.id, "No se pudo sincronizar.");

    const [updated] = await listQueuedCredits();
    expect(updated.status).toBe("failed");
    expect(updated.attempts).toBe(1);
    expect(updated.lastError).toBe("No se pudo sincronizar.");
  });

  it("removes a credit from the queue once synced", async () => {
    const item = await enqueueCredit(payload);

    await removeQueuedCredit(item.id);

    const queue = await listQueuedCredits();
    expect(queue).toHaveLength(0);
  });
});
