import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, CreditCard, Search, SlidersVertical } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { formatCurrency, formatDate } from "@/entities/credit/format";
import type { Credit, CreditFilters } from "@/entities/credit/types";
import { listCredits } from "@/features/credits/api";
import {
  BottomSheetModal,
  type BottomSheetModalRef,
  ErrorMessage,
  SectionFooterMessage,
  SectionHeader,
  colors,
} from "@/shared/ui";
import { CreditFiltersSheetContent } from "./CreditFiltersSheetContent";

type CreditListPageProps = NativeStackScreenProps<RootStackParamList, "CreditList">;

const SEARCH_DEBOUNCE_MS = 400;

const defaultFilters: CreditFilters = {
  clientName: "",
  clientDocument: "",
  salesperson: "",
  sortBy: "createdAt",
  direction: "desc",
};

export function CreditListPage({ navigation }: CreditListPageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const filtersSheetRef = useRef<BottomSheetModalRef>(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<CreditFilters>(defaultFilters);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((previous) => ({ ...previous, clientName: searchText.trim() }));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listCredits(filters);
      setCredits(response.items ?? []);
    } catch (err) {
      setCredits([]);
      setError(err instanceof Error ? err.message : "No se pudieron cargar los créditos.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSort = useCallback(() => {
    setFilters((previous) => ({
      ...previous,
      direction: previous.direction === "desc" ? "asc" : "desc",
    }));
  }, []);

  const applyFilters = useCallback((nextFilters: CreditFilters) => {
    setFilters((previous) => ({ ...previous, ...nextFilters, clientName: previous.clientName }));
    filtersSheetRef.current?.dismiss();
  }, []);

  const sections = useMemo(() => [{ title: "Créditos activos", data: credits }], [credits]);
  const isInitialLoad = loading && credits.length === 0;

  return (
    <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
      <View className="relative my-2 flex justify-center py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
          <ArrowLeft color={isDarkMode ? colors.violet400 : colors.violet700} size={24} />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Consulta</Text>
      </View>

      <View className="pb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Créditos</Text>
      </View>

      <View className="pb-4">
        <View className="flex-row items-center gap-2 rounded-lg bg-gray-100 py-2 pl-3 pr-2 dark:bg-neutral-900">
          <Search color={isDarkMode ? colors.neutral400 : colors.gray400} size={20} />
          <TextInput
            className="flex-1 text-gray-500 dark:text-neutral-400"
            placeholder="Buscar por cliente"
            placeholderTextColor={isDarkMode ? colors.neutral400 : colors.gray500}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity onPress={() => filtersSheetRef.current?.present()} activeOpacity={0.6} hitSlop={8}>
            <SlidersVertical color={isDarkMode ? colors.violet400 : colors.violet600} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {isInitialLoad ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={isDarkMode ? colors.violet400 : colors.violet700} />
        </View>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <SectionHeader
              title={section.title}
              count={credits.length}
              sortOrder={filters.direction}
              sortLabel={filters.sortBy === "amount" ? "Valor" : "Fecha"}
              onToggleSort={toggleSort}
            />
          )}
          renderItem={({ item }) => <CreditListItem credit={item} />}
          renderSectionFooter={() => credits.length === 0 ? <SectionFooterMessage>No hay créditos activos para mostrar.</SectionFooterMessage> : null}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <BottomSheetModal ref={filtersSheetRef}>
        <CreditFiltersSheetContent filters={filters} onApply={applyFilters} onClose={() => filtersSheetRef.current?.dismiss()} />
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
});

type CreditListItemProps = {
  credit: Credit;
};

function CreditListItem({ credit }: CreditListItemProps) {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <TouchableHighlight
      underlayColor={isDarkMode ? colors.neutral600 : colors.gray300}
      accessibilityRole="text"
      accessibilityLabel={`${credit.clientName}, ${formatCurrency(credit.amount)}`}
    >
      <View className="flex-row items-center gap-4 border-t border-gray-200 bg-white py-4 dark:border-neutral-800 dark:bg-neutral-950">
        <View className="size-10 items-center justify-center rounded-full bg-violet-100 dark:bg-neutral-800">
          <CreditCard color={isDarkMode ? colors.violet400 : colors.violet700} size={20} />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-gray-900 dark:text-neutral-50">{credit.clientName}</Text>
          <Text className="mt-1 text-gray-500 dark:text-neutral-400">
            {credit.clientDocument} · {credit.salespersonName}
          </Text>
          <Text className="mt-1 text-gray-500 dark:text-neutral-400">
            {credit.termMonths} meses · {credit.interestRate}% · {formatDate(credit.createdAt)}
          </Text>
        </View>
        <Text className="text-right text-sm font-bold text-gray-900 dark:text-neutral-50">{formatCurrency(credit.amount)}</Text>
      </View>
    </TouchableHighlight>
  );
}
