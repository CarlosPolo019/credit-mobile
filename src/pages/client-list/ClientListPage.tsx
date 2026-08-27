import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/navigation";
import type { Client } from "@/entities/credit/types";
import { useSession } from "@/entities/session/SessionContext";
import { listClients } from "@/features/credits/api";
import { ErrorMessage, PersonChip, Screen, SectionFooterMessage, colors } from "@/shared/ui";

type ClientListPageProps = NativeStackScreenProps<RootStackParamList, "ClientList">;

const PAGE_SIZE = 6;

/**
 * Read-only directory of clients (cédula + nombre) — same data/endpoint as
 * the credit form's autocomplete, same "ADMIN only" rule as credit-web's
 * /clients (there the endpoint itself has no role check, only the view).
 */
export function ClientListPage({ navigation }: ClientListPageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAdmin) navigation.goBack();
  }, [isAdmin, navigation]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError("");
    listClients()
      .then((items) => setClients(items ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudieron cargar los clientes."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredClients = normalizedSearch
    ? clients.filter((client) => `${client.document} ${client.fullName}`.toLowerCase().includes(normalizedSearch))
    : clients;

  const pageCount = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount);
  useEffect(() => {
    if (page !== clampedPage) setPage(clampedPage);
  }, [page, clampedPage]);

  const pagedClients = useMemo(
    () => filteredClients.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE),
    [filteredClients, clampedPage],
  );

  if (!isAdmin) return null;

  return (
    <Screen scroll={false} contentClassName="pt-2">
      <View className="relative my-2 flex justify-center py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
          <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Clientes</Text>
      </View>

      <View className="pb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Clientes registrados</Text>
        <Text className="mt-2 text-gray-500 dark:text-neutral-400">Se completan solos al registrar un crédito con esa cédula.</Text>
      </View>

      <View className="pb-4">
        <View className="flex-row items-center gap-2 rounded-lg bg-gray-100 py-2 pl-3 pr-2 dark:bg-neutral-900">
          <Search color={isDarkMode ? colors.neutral400 : colors.gray400} size={20} />
          <TextInput
            className="flex-1 text-gray-500 dark:text-neutral-400"
            placeholder="Buscar por cédula o nombre"
            placeholderTextColor={isDarkMode ? colors.neutral400 : colors.gray500}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading && clients.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={isDarkMode ? colors.brand400 : colors.brand700} />
        </View>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : pagedClients.length === 0 ? (
        <SectionFooterMessage>No hay clientes para mostrar.</SectionFooterMessage>
      ) : (
        <View className="flex-1">
          {pagedClients.map((client) => (
            <View key={client.document} className="border-t border-gray-200 py-4 dark:border-neutral-800">
              <PersonChip name={client.fullName} secondaryText={client.document} size={40} />
            </View>
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
