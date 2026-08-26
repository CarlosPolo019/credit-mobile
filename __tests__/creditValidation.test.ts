import { validateCredit } from "@/entities/credit/validation";

describe("validateCredit", () => {
  it("normalizes valid input", () => {
    const result = validateCredit({
      clientFirstName: " Pepito ",
      clientSecondName: "",
      clientFirstSurname: " Perez ",
      clientSecondSurname: "",
      clientDocument: " 100000001 ",
      amount: "7800000",
      interestRate: "2",
      termMonths: "10",
    });

    expect(result.isValid).toBe(true);
    expect(result.value.clientFirstName).toBe("Pepito");
    expect(result.value.clientFirstSurname).toBe("Perez");
    expect(result.value.clientDocument).toBe("100000001");
    expect(result.value.termMonths).toBe(10);
  });

  it("rejects invalid numbers", () => {
    const result = validateCredit({
      clientFirstName: "",
      clientSecondName: "",
      clientFirstSurname: "",
      clientSecondSurname: "",
      clientDocument: "",
      amount: "0",
      interestRate: "-1",
      termMonths: "0",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.amount).toBe("El valor debe ser mayor que cero.");
  });
});
