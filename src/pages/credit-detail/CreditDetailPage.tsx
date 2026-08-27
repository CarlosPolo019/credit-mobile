import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, Download, Pencil, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { formatCurrency, formatDate } from "@/entities/credit/format";
import type { Credit, CreditAuditEntry } from "@/entities/credit/types";
import { useSession } from "@/entities/session/SessionContext";
import { deleteCredit, getCredit, getCreditAudit } from "@/features/credits/api";
import { downloadAndShareCreditPdf } from "@/features/credits/pdf";
import { Banner, BottomSheetModal, type BottomSheetModalRef, Button, ErrorMessage, PersonAvatar, PersonChip, Screen, colors } from "@/shared/ui";
import { CreditAuditHistory } from "./CreditAuditHistory";
import { DeleteCreditSheetContent } from "./DeleteCreditSheetContent";

type CreditDetailPageProps = NativeStackScreenProps<RootStackParamList, "CreditDetail">;

function clientFullName(credit: Credit) {
  return (
    credit.clientName ||
    [credit.clientFirstName, credit.clientSecondName, credit.clientFirstSurname, credit.clientSecondSurname]
      .filter(Boolean)
      .join(" ")
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-0.5">
      <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900 dark:text-neutral-50">{value}</Text>
    </View>
  );
}

export function CreditDetailPage({ navigation, route }: CreditDetailPageProps) {
  const { creditId } = route.params;
  const isDarkMode = useColorScheme() === "dark";
  const { session } = useSession();
  const [credit, setCredit] = useState<Credit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [auditEntries, setAuditEntries] = useState<CreditAuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const deleteSheetRef = useRef<BottomSheetModalRef>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCredit(creditId);
      setCredit(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el crédito.");
    } finally {
      setLoading(false);
    }
  }, [creditId]);

  const loadAudit = useCallback(async () => {
    setAuditLoading(true);
    try {
      const entries = await getCreditAudit(creditId);
      setAuditEntries(entries ?? []);
    } catch {
      setAuditEntries([]);
    } finally {
      setAuditLoading(false);
    }
  }, [creditId]);

  useEffect(() => {
    load();
    loadAudit();
  }, [load, loadAudit]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      load();
      loadAudit();
    });
    return unsubscribe;
  }, [navigation, load, loadAudit]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCredit(creditId);
      deleteSheetRef.current?.dismiss();
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el crédito.");
      deleteSheetRef.current?.dismiss();
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError("");
    try {
      await downloadAndShareCreditPdf(creditId, session?.token ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo exportar el PDF.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-950">
        <ActivityIndicator color={isDarkMode ? colors.brand400 : colors.brand700} />
      </View>
    );
  }

  if (error && !credit) {
    return (
      <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
        <View className="relative my-2 flex justify-center py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
            <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
          </TouchableOpacity>
        </View>
        <ErrorMessage>{error}</ErrorMessage>
      </View>
    );
  }

  if (!credit) return null;

  const monthlyPayment = credit.estimatedMonthlyPayment ?? 0;
  const totalToPay = credit.estimatedTotalToPay ?? 0;

  return (
    <>
      <Screen contentClassName="pb-10">
        <View className="relative my-2 flex justify-center py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
            <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
          </TouchableOpacity>
          <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Detalle</Text>
        </View>

        <View className="gap-4 pb-4">
          <Banner message={error} />

          <View className="flex-row items-center gap-3">
            <PersonAvatar name={clientFullName(credit)} size={48} />
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-neutral-50">{clientFullName(credit)}</Text>
              <Text className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                {credit.isActive === false ? "Inactivo" : "Activo"}
              </Text>
            </View>
          </View>

          <View className="rounded-2xl p-5" style={{ backgroundColor: colors.brand100 }}>
            <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.brand700 }}>
              Valor del crédito
            </Text>
            <Text className="mt-1 text-3xl font-bold" style={{ color: colors.ink }}>
              {formatCurrency(credit.amount)}
            </Text>
          </View>

          <View className="flex-row gap-3">
            <Button title="Editar" variant="secondary" icon={<Pencil color={isDarkMode ? colors.brand400 : colors.brand700} size={16} />} onPress={() => navigation.navigate("CreditEdit", { creditId })} className="flex-1" />
            <Button title="Eliminar" variant="secondary" icon={<Trash2 color="#dc2626" size={16} />} onPress={() => deleteSheetRef.current?.present()} className="flex-1" />
          </View>
          <Button
            title={exporting ? "Generando..." : "Exportar PDF"}
            variant="primary"
            icon={<Download color={colors.ink} size={16} />}
            onPress={handleExport}
            loading={exporting}
          />

          <View className="gap-3 rounded-2xl border border-gray-100 p-4 dark:border-neutral-900">
            <Text className="text-sm font-bold text-gray-900 dark:text-neutral-50">Cliente</Text>
            <DetailRow label="Cédula o ID" value={credit.clientDocument} />
          </View>

          <View className="gap-3 rounded-2xl border border-gray-100 p-4 dark:border-neutral-900">
            <Text className="text-sm font-bold text-gray-900 dark:text-neutral-50">Condiciones</Text>
            <View className="flex-row gap-6">
              <DetailRow label="Tasa mensual" value={`${credit.interestRate}%`} />
              <DetailRow label="Plazo" value={`${credit.termMonths} meses`} />
            </View>
            <View className="flex-row gap-6">
              <DetailRow label="Cuota estimada" value={formatCurrency(monthlyPayment)} />
              <DetailRow label="Total estimado" value={formatCurrency(totalToPay)} />
            </View>
          </View>

          <View className="gap-3 rounded-2xl border border-gray-100 p-4 dark:border-neutral-900">
            <Text className="text-sm font-bold text-gray-900 dark:text-neutral-50">Registro</Text>
            <PersonChip name={credit.salespersonName} secondaryText="Comercial" size={32} />
            <DetailRow label="Fecha" value={formatDate(credit.createdAt)} />
          </View>

          <View className="gap-2 rounded-2xl border border-gray-100 p-4 dark:border-neutral-900">
            <Text className="text-sm font-bold text-gray-900 dark:text-neutral-50">Historial de cambios</Text>
            <CreditAuditHistory entries={auditEntries} isLoading={auditLoading} />
          </View>
        </View>
      </Screen>

      <BottomSheetModal ref={deleteSheetRef}>
        <DeleteCreditSheetContent
          clientName={clientFullName(credit)}
          onCancel={() => deleteSheetRef.current?.dismiss()}
          onConfirm={handleDelete}
          isSubmitting={deleting}
        />
      </BottomSheetModal>
    </>
  );
}
