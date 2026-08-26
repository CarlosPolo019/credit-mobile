import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import type { CreditDirection, CreditFilters, CreditSortBy } from "@/entities/credit/types";
import { Button, TextField, colors } from "@/shared/ui";

type CreditFiltersSheetContentProps = {
  filters: CreditFilters;
  salespersonOptions: string[];
  onApply: (filters: CreditFilters) => void;
  onClose: () => void;
};

const sortOptions: { label: string; value: CreditSortBy }[] = [
  { label: "Fecha", value: "createdAt" },
  { label: "Valor", value: "amount" },
];

const directionOptions: { label: string; value: CreditDirection }[] = [
  { label: "Desc", value: "desc" },
  { label: "Asc", value: "asc" },
];

export function CreditFiltersSheetContent({ filters, salespersonOptions, onApply, onClose }: CreditFiltersSheetContentProps) {
  const isDarkMode = useColorScheme() === "dark";
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const setValue = <TKey extends keyof CreditFilters>(key: TKey, value: CreditFilters[TKey]) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
  };

  const salespersonSelectOptions = [{ label: "Todos", value: "" }, ...salespersonOptions.map((name) => ({ label: name, value: name }))];

  return (
    <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
      <View className="relative my-2 flex justify-center py-4">
        <TouchableOpacity onPress={onClose} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
          <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Filtros</Text>
      </View>

      <View className="gap-4 pt-4">
        <TextField
          label="Cédula o ID"
          value={draft.clientDocument}
          onChangeText={(value) => setValue("clientDocument", value)}
          keyboardType="number-pad"
        />
        <FilterSection title="Comercial" options={salespersonSelectOptions} selectedValue={draft.salesperson} onSelect={(value) => setValue("salesperson", value)} wrap />
        <FilterSection title="Ordenar por" options={sortOptions} selectedValue={draft.sortBy} onSelect={(value) => setValue("sortBy", value)} />
        <FilterSection title="Dirección" options={directionOptions} selectedValue={draft.direction} onSelect={(value) => setValue("direction", value)} />
      </View>

      <View className="mt-auto gap-3 pb-4 pt-6">
        <Button title="Aplicar filtros" onPress={() => onApply(draft)} />
        <Button
          title="Limpiar"
          variant="secondary"
          onPress={() => onApply({ ...draft, clientDocument: "", salesperson: "", sortBy: "createdAt", direction: "desc" })}
        />
      </View>
    </View>
  );
}

type FilterOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type FilterSectionProps<TValue extends string> = {
  title: string;
  options: FilterOption<TValue>[];
  selectedValue: TValue;
  onSelect: (value: TValue) => void;
  wrap?: boolean;
};

function FilterSection<TValue extends string>({ title, options, selectedValue, onSelect, wrap = false }: FilterSectionProps<TValue>) {
  return (
    <View className="gap-2">
      <Text className="text-gray-500 dark:text-neutral-400">{title}</Text>
      <View className={wrap ? "flex-row flex-wrap gap-2" : "flex-row gap-3"}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.6}
            className={`items-center justify-center rounded-lg px-4 py-3 ${wrap ? "" : "flex-1"} ${
              selectedValue === option.value ? "" : "border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            }`}
            style={selectedValue === option.value ? { backgroundColor: colors.brand100 } : undefined}
          >
            <Text
              className={`text-sm font-semibold ${selectedValue === option.value ? "" : "text-gray-900 dark:text-neutral-50"}`}
              style={selectedValue === option.value ? { color: colors.brand700 } : undefined}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
