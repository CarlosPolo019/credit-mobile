import { Text, View } from "react-native";
import { estimateCreditPayment } from "@/entities/credit/payment";
import type { CreditPayload } from "@/entities/credit/types";
import { formatCurrency } from "@/entities/credit/format";
import { Button } from "@/shared/ui";

type CreditConfirmSheetContentProps = {
  credit: CreditPayload;
  salespersonLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  mode?: "create" | "edit";
};

function SummaryRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <View className="flex-row items-baseline justify-between border-b border-gray-100 py-2 dark:border-neutral-900">
      <Text className="text-gray-500 dark:text-neutral-400">{label}</Text>
      <Text className={`font-semibold text-gray-900 dark:text-neutral-50 ${emphasis ? "text-base" : "text-sm"}`}>{value}</Text>
    </View>
  );
}

/**
 * Last-look confirmation before a credit is sent to the backend. Shows the
 * operator exactly what will be registered and an estimated payoff so a
 * typo (an extra zero on the amount, the wrong term) gets caught here
 * instead of after the client has already been notified by email. Mirrors
 * `credit-web/pages/credits/CreditConfirmDialog.jsx`.
 */
export function CreditConfirmSheetContent({ credit, salespersonLabel, onCancel, onConfirm, isSubmitting, mode = "create" }: CreditConfirmSheetContentProps) {
  const isEdit = mode === "edit";
  const fullName = [credit.clientFirstName, credit.clientSecondName, credit.clientFirstSurname, credit.clientSecondSurname]
    .filter(Boolean)
    .join(" ");
  const { monthlyPayment, totalToPay } = estimateCreditPayment(credit);

  return (
    <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
      <View className="items-center py-4">
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">¿Todo correcto?</Text>
        <Text className="mt-1 text-center text-sm text-gray-500 dark:text-neutral-400">
          {isEdit
            ? "Revisa los datos antes de guardar los cambios del crédito."
            : "Revisa los datos antes de registrar. Una vez confirmado, se notifica al cliente por correo."}
        </Text>
      </View>

      <View className="gap-1 pt-2">
        <SummaryRow label="Cliente" value={fullName} />
        <SummaryRow label="Cédula o ID" value={credit.clientDocument} />
        <SummaryRow label="Comercial" value={salespersonLabel} />
        <SummaryRow label="Valor del crédito" value={formatCurrency(credit.amount)} />
        <SummaryRow label="Tasa de interés mensual" value={`${credit.interestRate}%`} />
        <SummaryRow label="Plazo" value={`${credit.termMonths} meses`} />
        <SummaryRow label="Cuota mensual estimada" value={formatCurrency(monthlyPayment)} emphasis />
        <SummaryRow label="Total estimado a pagar" value={formatCurrency(totalToPay)} emphasis />
      </View>

      <Text className="pt-3 text-xs text-gray-500 dark:text-neutral-400">
        Cálculo estimado (amortización francesa, tasa mensual fija). El backend no lo almacena; sirve solo como referencia para el cliente.
      </Text>

      <View className="mt-auto gap-3 pb-4 pt-6">
        <Button title={isEdit ? "Confirmar cambios" : "Confirmar y registrar"} onPress={onConfirm} loading={isSubmitting} />
        <Button title="Revisar datos" variant="secondary" onPress={onCancel} disabled={isSubmitting} />
      </View>
    </View>
  );
}
