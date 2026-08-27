import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { formatCurrency, formatDate } from "@/entities/credit/format";
import type { EmailJob, EmailJobFilters, EmailJobStatus } from "@/entities/email-job/types";
import { useSession } from "@/entities/session/SessionContext";
import { listEmailJobs } from "@/features/email-jobs/api";
import { ErrorMessage, PersonChip, Screen, SectionFooterMessage, colors } from "@/shared/ui";

type EmailJobListPageProps = NativeStackScreenProps<RootStackParamList, "EmailJobList">;

const PAGE_SIZE = 6;
const SEARCH_DEBOUNCE_MS = 400;

const defaultFilters: EmailJobFilters = {
  status: "",
  search: "",
  sortBy: "createdAt",
  direction: "desc",
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendiente" },
  { value: "PROCESSING", label: "Procesando" },
  { value: "SENT", label: "Enviado" },
  { value: "RETRY", label: "Reintentando" },
  { value: "FAILED", label: "Fallido" },
];

const STATUS_STYLES: Record<EmailJobStatus, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-gray-200 dark:bg-neutral-800", text: "text-gray-700 dark:text-neutral-300", label: "Pendiente" },
  PROCESSING: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300", label: "Procesando" },
  SENT: { bg: "bg-green-100 dark:bg-green-950", text: "text-green-700 dark:text-green-300", label: "Enviado" },
  RETRY: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300", label: "Reintentando" },
  FAILED: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-300", label: "Fallido" },
};

/**
 * Admin-only, same rule as credit-web's /email-jobs: hidden from Home and,
 * as a second line of defense, redirects back if reached without the role
 * — the backend also 403s the endpoint for a non-ADMIN token either way.
 */
export function EmailJobListPage({ navigation }: EmailJobListPageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<EmailJobFilters>(defaultFilters);
  const [jobs, setJobs] = useState<EmailJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAdmin) navigation.replace("Home");
  }, [isAdmin, navigation]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((previous) => ({ ...previous, search: searchText.trim() }));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError("");
    try {
      const response = await listEmailJobs(filters);
      setJobs(response.items ?? []);
    } catch (err) {
      setJobs([]);
      setError(err instanceof Error ? err.message : "No se pudieron cargar los correos.");
    } finally {
      setLoading(false);
    }
  }, [filters, isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const pageCount = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount);
  useEffect(() => {
    if (page !== clampedPage) setPage(clampedPage);
  }, [page, clampedPage]);

  const pagedJobs = useMemo(() => jobs.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE), [jobs, clampedPage]);

  if (!isAdmin) return null;

  return (
    <Screen scroll={false} contentClassName="pt-2">
      <View className="relative my-2 flex justify-center py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
          <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Correos</Text>
      </View>

      <View className="pb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Estado de envíos</Text>
      </View>

      <View className="pb-3">
        <View className="flex-row items-center gap-2 rounded-lg bg-gray-100 py-2 pl-3 pr-2 dark:bg-neutral-900">
          <Search color={isDarkMode ? colors.neutral400 : colors.gray400} size={20} />
          <TextInput
            className="flex-1 text-gray-500 dark:text-neutral-400"
            placeholder="Buscar por cliente o destinatario"
            placeholderTextColor={isDarkMode ? colors.neutral400 : colors.gray500}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 flex-row" contentContainerClassName="gap-2">
        {STATUS_OPTIONS.map((option) => {
          const active = filters.status === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => setFilters((previous) => ({ ...previous, status: option.value }))}
              activeOpacity={0.7}
              className={`rounded-full border px-3 py-1.5 ${
                active
                  ? "border-brand-700 bg-brand-100 dark:border-brand-400 dark:bg-neutral-800"
                  : "border-gray-200 dark:border-neutral-800"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  active ? "text-brand-700 dark:text-brand-400" : "text-gray-500 dark:text-neutral-400"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading && jobs.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={isDarkMode ? colors.brand400 : colors.brand700} />
        </View>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : pagedJobs.length === 0 ? (
        <SectionFooterMessage>No hay correos para mostrar.</SectionFooterMessage>
      ) : (
        <View className="flex-1">
          {pagedJobs.map((job) => (
            <EmailJobRow key={job.id} job={job} />
          ))}
        </View>
      )}

      {pageCount > 1 ? (
        <View className="flex-row items-center justify-between border-t border-gray-200 py-3 dark:border-neutral-800">
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
    </Screen>
  );
}

function EmailJobRow({ job }: { job: EmailJob }) {
  const style = STATUS_STYLES[job.status] ?? STATUS_STYLES.PENDING;
  const showError = (job.status === "FAILED" || job.status === "RETRY") && job.lastError;

  return (
    <View className="gap-1 border-t border-gray-200 py-4 dark:border-neutral-800">
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <PersonChip name={job.clientName} secondaryText={job.recipient} size={40} />
        </View>
        <View className={`rounded-full px-2 py-1 ${style.bg}`}>
          <Text className={`text-xs font-semibold ${style.text}`}>{style.label}</Text>
        </View>
      </View>
      <View className="ml-[52px]">
        <PersonChip name={job.salespersonName} secondaryText={`${formatCurrency(job.creditAmount)} · ${formatDate(job.createdAt)}`} size={22} />
      </View>
      {showError ? <Text className="text-red-600 dark:text-red-400">{job.lastError}</Text> : null}
    </View>
  );
}
