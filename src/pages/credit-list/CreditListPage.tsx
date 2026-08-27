import { ChevronLeft, ChevronRight, CreditCard, Search, SlidersVertical } from "lucide-react-native";
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
import type { TabScreenProps } from "@/app/navigation";
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

type CreditListPageProps = TabScreenProps<"CreditList">;

const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE = 6;

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
  const [salespersonOptions, setSalespersonOptions] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // One-time, unfiltered fetch just to know which comerciales exist, so
    // the filter sheet can offer a select instead of free text. Independent
    // of `credits` (which is scoped by the active filters) to avoid the
    // option list shrinking to just whichever salesperson is selected.
    listCredits(defaultFilters)
      .then((response) => {
        const names = Array.from(new Set((response.items ?? []).map((credit) => credit.salespersonName).filter(Boolean)));
        names.sort((a, b) => a.localeCompare(b));
        setSalespersonOptions(names);
      })
      .catch(() => setSalespersonOptions([]));
  }, []);

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

  // A new search/filter/sort starts back at page 1.
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const pageCount = Math.max(1, Math.ceil(credits.length / PAGE_SIZE));
  // Derive the in-range page synchronously so a stale `page` after
  // `credits` shrinks never slices to an empty page for a frame.
  const clampedPage = Math.min(page, pageCount);
  useEffect(() => {
    if (page !== clampedPage) setPage(clampedPage);
  }, [page, clampedPage]);

  const pagedCredits = useMemo(
    () => credits.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE),
    [credits, clampedPage],
  );

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

  const sections = useMemo(() => [{ title: "Créditos activos", data: pagedCredits }], [pagedCredits]);
  const isInitialLoad = loading && credits.length === 0;

  return (
    <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
      <View className="pb-2 pt-6">
        <Text className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Consulta</Text>
        <Text className="mt-1 text-2xl font-bold text-gray-900 dark:text-neutral-50">Créditos</Text>
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
            <SlidersVertical color={isDarkMode ? colors.brand400 : colors.brand700} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {isInitialLoad ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={isDarkMode ? colors.brand400 : colors.brand700} />
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
          renderItem={({ item }) => (
            <CreditListItem credit={item} onPress={() => navigation.navigate("CreditDetail", { creditId: item.id })} />
          )}
          renderSectionFooter={() => credits.length === 0 ? <SectionFooterMessage>No hay créditos activos para mostrar.</SectionFooterMessage> : null}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {!isInitialLoad && !error && pageCount > 1 ? (
        <View className="flex-row items-center justify-between border-t border-gray-200 py-3 pb-24 dark:border-neutral-800">
          <TouchableOpacity
            onPress={() => setPage((previous) => Math.max(1, previous - 1))}
            disabled={clampedPage <= 1}
            activeOpacity={0.6}
            hitSlop={8}
            className="flex-row items-center gap-1 p-2"
          >
            <ChevronLeft color={clampedPage <= 1 ? colors.gray300 : isDarkMode ? colors.brand400 : colors.brand700} size={20} />
            <Text className={`text-sm font-semibold ${clampedPage <= 1 ? "text-gray-300 dark:text-neutral-700" : "text-gray-900 dark:text-neutral-50"}`}>
              Anterior
            </Text>
          </TouchableOpacity>
          <Text className="text-sm text-gray-500 dark:text-neutral-400">
            Página {clampedPage} de {pageCount}
          </Text>
          <TouchableOpacity
            onPress={() => setPage((previous) => Math.min(pageCount, previous + 1))}
            disabled={clampedPage >= pageCount}
            activeOpacity={0.6}
            hitSlop={8}
            className="flex-row items-center gap-1 p-2"
          >
            <Text className={`text-sm font-semibold ${clampedPage >= pageCount ? "text-gray-300 dark:text-neutral-700" : "text-gray-900 dark:text-neutral-50"}`}>
              Siguiente
            </Text>
            <ChevronRight color={clampedPage >= pageCount ? colors.gray300 : isDarkMode ? colors.brand400 : colors.brand700} size={20} />
          </TouchableOpacity>
        </View>
      ) : null}

      <BottomSheetModal ref={filtersSheetRef}>
        <CreditFiltersSheetContent
          filters={filters}
          salespersonOptions={salespersonOptions}
          onApply={applyFilters}
          onClose={() => filtersSheetRef.current?.dismiss()}
        />
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    // Extra clearance so the last row isn't hidden behind the floating tab
    // bar when there's no pagination row underneath to already provide it.
    paddingBottom: 112,
  },
});

type CreditListItemProps = {
  credit: Credit;
  onPress: () => void;
};

function CreditListItem({ credit, onPress }: CreditListItemProps) {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={isDarkMode ? colors.neutral600 : colors.gray300}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${credit.clientName}, ${formatCurrency(credit.amount)}`}
    >
      <View className="flex-row items-center gap-4 border-t border-gray-200 bg-white py-4 dark:border-neutral-800 dark:bg-neutral-950">
        <View className="size-10 items-center justify-center rounded-full bg-brand-100 dark:bg-neutral-800">
          <CreditCard color={isDarkMode ? colors.brand400 : colors.brand700} size={20} />
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
