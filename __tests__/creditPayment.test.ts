import { estimateCreditPayment } from "@/entities/credit/payment";

describe("estimateCreditPayment", () => {
  it("computes a fixed monthly installment for a standard rate", () => {
    const { monthlyPayment, totalToPay } = estimateCreditPayment({
      amount: 1000000,
      interestRate: 2,
      termMonths: 12,
    });

    expect(Math.abs(monthlyPayment - 94559.5966)).toBeLessThan(0.01);
    expect(Math.abs(totalToPay - monthlyPayment * 12)).toBeLessThan(0.01);
  });

  it("falls back to a straight split when the rate is zero", () => {
    const { monthlyPayment, totalToPay } = estimateCreditPayment({
      amount: 1200000,
      interestRate: 0,
      termMonths: 12,
    });

    expect(monthlyPayment).toBe(100000);
    expect(totalToPay).toBe(1200000);
  });

  it("returns zero for a missing or non-positive term", () => {
    const result = estimateCreditPayment({ amount: 1000000, interestRate: 2, termMonths: 0 });
    expect(result).toEqual({ monthlyPayment: 0, totalToPay: 0 });
  });
});
