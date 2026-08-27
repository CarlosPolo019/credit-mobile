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

  it("rejects amount over the max, and rate/term outside their bounds", () => {
    const result = validateCredit({
      clientFirstName: "Pepito",
      clientSecondName: "",
      clientFirstSurname: "Perez",
      clientSecondSurname: "",
      clientDocument: "100000001",
      amount: "200000001",
      interestRate: "4",
      termMonths: "61",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.amount).toBe("El valor del crédito no puede superar 200.000.000.");
    expect(result.errors.interestRate).toBe("La tasa de interés mensual no puede superar 3.5%.");
    expect(result.errors.termMonths).toBe("El plazo no puede superar 60 meses.");
  });

  it("accepts the max bounds exactly", () => {
    const result = validateCredit({
      clientFirstName: "Pepito",
      clientSecondName: "",
      clientFirstSurname: "Perez",
      clientSecondSurname: "",
      clientDocument: "100000001",
      amount: "200000000",
      interestRate: "3.5",
      termMonths: "60",
    });

    expect(result.isValid).toBe(true);
  });
});
