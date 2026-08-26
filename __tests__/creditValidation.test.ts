import { validateCredit } from "@/entities/credit/validation";

describe("validateCredit", () => {
  it("normalizes valid input", () => {
    const result = validateCredit({
      clientName: " Pepito  Perez ",
      clientDocument: " SEED-001 ",
      amount: "7800000",
      interestRate: "2",
      termMonths: "10",
      salespersonName: " Comercial Seed ",
    });

    expect(result.isValid).toBe(true);
    expect(result.value.clientName).toBe("Pepito Perez");
    expect(result.value.termMonths).toBe(10);
  });

  it("rejects invalid numbers", () => {
    const result = validateCredit({
      clientName: "",
      clientDocument: "",
      amount: "0",
      interestRate: "-1",
      termMonths: "0",
      salespersonName: "",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.amount).toBe("El valor debe ser mayor que cero.");
  });
});
