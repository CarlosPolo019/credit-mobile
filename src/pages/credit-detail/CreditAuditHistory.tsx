import { ActivityIndicator, Text, View } from "react-native";
import { formatCurrency, formatDate } from "@/entities/credit/format";
import type { CreditAuditEntry, CreditFieldChange } from "@/entities/credit/types";

const FIELD_LABELS: Record<string, string> = {
  clientFirstName: "Primer nombre",
  clientSecondName: "Segundo nombre",
  clientFirstSurname: "Primer apellido",
  clientSecondSurname: "Segundo apellido",
  clientDocument: "Cédula o ID",
  amount: "Valor del crédito",
  interestRate: "Tasa de interés mensual",
  termMonths: "Plazo",
};

function formatFieldValue(field: string, value: string) {
  if (!value) return "(vacío)";
  if (field === "amount") return formatCurrency(value);
  if (field === "interestRate") return `${value}%`;
  if (field === "termMonths") return `${value} meses`;
  return value;
}

function ChangeRow({ field, change }: { field: string; change: CreditFieldChange }) {
  return (
    <View className="flex-row flex-wrap items-baseline gap-x-2 py-1">
      <Text className="w-full text-xs font-bold text-gray-900 dark:text-neutral-50">{FIELD_LABELS[field] ?? field}</Text>
      <Text className="text-xs text-gray-500 dark:text-neutral-400">{formatFieldValue(field, change.before)}</Text>
      <Text className="text-xs text-gray-400">→</Text>
      <Text className="text-xs font-semibold text-gray-900 dark:text-neutral-50">{formatFieldValue(field, change.after)}</Text>
    </View>
  );
}

function AuditEntryRow({ entry }: { entry: CreditAuditEntry }) {
  const isDeleted = entry.action === "DELETED";
  const fields = Object.keys(entry.changes ?? {});

  return (
    <View className="gap-2 border-t border-gray-100 py-3 first:border-t-0 dark:border-neutral-900">
      <View className="flex-row flex-wrap items-center gap-2">
        <View className={`rounded-full px-2 py-0.5 ${isDeleted ? "bg-red-50 dark:bg-red-950" : "bg-brand-100 dark:bg-neutral-800"}`}>
          <Text className={`text-[10px] font-bold ${isDeleted ? "text-red-600 dark:text-red-400" : "text-brand-700 dark:text-brand-400"}`}>
            {isDeleted ? "Eliminado" : "Editado"}
          </Text>
        </View>
        <Text className="text-xs font-semibold text-gray-900 dark:text-neutral-50">
          {entry.changedByName || entry.changedByDocument}
        </Text>
        <Text className="text-xs text-gray-400 dark:text-neutral-500">{formatDate(entry.changedAt)}</Text>
      </View>
      {isDeleted ? null : (
        <View className="pl-1">
          {fields.map((field) => (
            <ChangeRow key={field} field={field} change={entry.changes[field]} />
          ))}
        </View>
      )}
    </View>
  );
}

type CreditAuditHistoryProps = {
  entries: CreditAuditEntry[];
  isLoading: boolean;
};

export function CreditAuditHistory({ entries, isLoading }: CreditAuditHistoryProps) {
  if (isLoading) {
    return <ActivityIndicator className="py-2" />;
  }
  if (!entries.length) {
    return <Text className="text-sm text-gray-500 dark:text-neutral-400">Sin cambios registrados todavía.</Text>;
  }
  return (
    <View>
      {entries.map((entry) => (
        <AuditEntryRow key={entry.id} entry={entry} />
      ))}
    </View>
  );
}
