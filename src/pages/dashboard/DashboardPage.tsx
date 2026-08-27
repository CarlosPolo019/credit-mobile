import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, Crown, ListChecks, Percent, TrendingUp, Wallet } from "lucide-react-native";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { formatCurrency } from "@/entities/credit/format";
import type { Credit } from "@/entities/credit/types";
import type { EmailJob, EmailJobStatus } from "@/entities/email-job/types";
import { useSession } from "@/entities/session/SessionContext";
import { listCredits } from "@/features/credits/api";
import { listEmailJobs } from "@/features/email-jobs/api";
import { ErrorMessage, Screen, SectionHeader, colors } from "@/shared/ui";

type DashboardPageProps = NativeStackScreenProps<RootStackParamList, "Dashboard">;

const STATUS_LABELS: Record<EmailJobStatus, string> = {
  PENDING: "Pendiente",
  PROCESSING: "Procesando",
  SENT: "Enviado",
  RETRY: "Reintentando",
  FAILED: "Fallido",
};

// Solid bar-segment colors — SENT gets the brand green (per credit-web's
// dashboard), the rest use muted/warm tones already used for status pills
// elsewhere in this app (see EmailJobListPage's STATUS_STYLES), just solid
// instead of the light "-100" tint so they read on a thin bar.
const STATUS_BAR_COLORS: Record<EmailJobStatus, string> = {
  PENDING: "bg-gray-400 dark:bg-neutral-600",
  PROCESSING: "bg-blue-500 dark:bg-blue-600",
  SENT: "bg-brand-600 dark:bg-brand-400",
  RETRY: "bg-amber-500 dark:bg-amber-600",
  FAILED: "bg-red-500 dark:bg-red-600",
};

const STATUS_DOT_COLORS: Record<EmailJobStatus, string> = {
  PENDING: colors.gray400,
  PROCESSING: "#3B82F6",
  SENT: colors.brand600,
  RETRY: "#F59E0B",
  FAILED: "#EF4444",
};

const STATUS_ORDER: EmailJobStatus[] = ["SENT", "PENDING", "PROCESSING", "RETRY", "FAILED"];

type ComercialStat = { name: string; count: number };
type StatusStat = { status: EmailJobStatus; count: number };

/**
 * Admin-only aggregate view of the same data credit-web's Dashboard shows,
 * built client-side from the full credit/email-job lists (no dedicated
 * backend endpoint) — mirrors ClientListPage/EmailJobListPage's admin gate
 * and loading/error idiom.
 */
export function DashboardPage({ navigation }: DashboardPageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [credits, setCredits] = useState<Credit[]>([]);
  const [emailJobs, setEmailJobs] = useState<EmailJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) navigation.replace("Home");
  }, [isAdmin, navigation]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError("");
    Promise.all([
      listCredits({ clientName: "", clientDocument: "", salesperson: "", sortBy: "createdAt", direction: "desc" }),
      listEmailJobs({ status: "", search: "", sortBy: "createdAt", direction: "desc" }),
    ])
      .then(([creditsResponse, emailJobsResponse]) => {
        setCredits(creditsResponse.items ?? []);
        setEmailJobs(emailJobsResponse.items ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar el dashboard."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const stats = useMemo(() => {
    const activeCredits = credits.length;
    const totalAmount = credits.reduce((sum, credit) => sum + Number(credit.amount ?? 0), 0);
    const totalToPay = credits.reduce((sum, credit) => sum + Number(credit.estimatedTotalToPay ?? 0), 0);
    const estimatedProfit = totalToPay - totalAmount;
    const averageInterestRate = activeCredits
      ? credits.reduce((sum, credit) => sum + Number(credit.interestRate ?? 0), 0) / activeCredits
      : 0;

    const byComercial = new Map<string, number>();
    for (const credit of credits) {
      const name = credit.salespersonName?.trim() || "Sin comercial";
      byComercial.set(name, (byComercial.get(name) ?? 0) + 1);
    }
    const comercialStats: ComercialStat[] = Array.from(byComercial.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const byStatus = new Map<EmailJobStatus, number>();
    for (const job of emailJobs) {
      byStatus.set(job.status, (byStatus.get(job.status) ?? 0) + 1);
    }
    const statusStats: StatusStat[] = STATUS_ORDER.filter((status) => (byStatus.get(status) ?? 0) > 0).map(
      (status) => ({ status, count: byStatus.get(status) ?? 0 }),
    );

    return { activeCredits, totalAmount, estimatedProfit, averageInterestRate, comercialStats, statusStats };
  }, [credits, emailJobs]);

  if (!isAdmin) return null;

  const maxComercialCount = stats.comercialStats[0]?.count ?? 0;
  const totalEmailJobs = emailJobs.length;

  return (
    <Screen contentClassName="pt-2 pb-8">
      <View className="relative my-2 flex justify-center py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
          <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Dashboard</Text>
      </View>

      <View className="pb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Resumen general</Text>
        <Text className="mt-2 text-gray-500 dark:text-neutral-400">Créditos activos y estado de las notificaciones por correo.</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator color={isDarkMode ? colors.brand400 : colors.brand700} />
        </View>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <View className="gap-6">
          <View className="flex-row flex-wrap justify-between gap-y-3">
            <StatCard
              icon={<ListChecks color={isDarkMode ? colors.brand400 : colors.brand700} size={20} />}
              label="Créditos activos"
              value={String(stats.activeCredits)}
            />
            <StatCard
              icon={<Wallet color={isDarkMode ? colors.brand400 : colors.brand700} size={20} />}
              label="Monto solicitado"
              value={formatCurrency(stats.totalAmount)}
            />
            <StatCard
              icon={<TrendingUp color={isDarkMode ? colors.brand400 : colors.brand700} size={20} />}
              label="Ganancia estimada"
              value={formatCurrency(stats.estimatedProfit)}
            />
            <StatCard
              icon={<Percent color={isDarkMode ? colors.brand400 : colors.brand700} size={20} />}
              label="Tasa promedio"
              value={`${stats.averageInterestRate.toFixed(2)}%`}
            />
          </View>

          <View>
            <SectionHeader title="Créditos por comercial" count={stats.comercialStats.length} />
            <View className="gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              {stats.comercialStats.length === 0 ? (
                <Text className="text-gray-500 dark:text-neutral-400">No hay créditos registrados.</Text>
              ) : (
                stats.comercialStats.map((comercial, index) => (
                  <ComercialBarRow
                    key={comercial.name}
                    comercial={comercial}
                    isLeader={index === 0}
                    percentage={maxComercialCount ? (comercial.count / maxComercialCount) * 100 : 0}
                  />
                ))
              )}
            </View>
          </View>

          <View>
            <SectionHeader title="Correos por estado" count={totalEmailJobs} />
            <View className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              {stats.statusStats.length === 0 ? (
                <Text className="text-gray-500 dark:text-neutral-400">No hay correos registrados.</Text>
              ) : (
                <>
                  <View className="h-3 flex-row overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                    {stats.statusStats.map((entry) => (
                      <View
                        key={entry.status}
                        className={STATUS_BAR_COLORS[entry.status]}
                        style={{ width: `${(entry.count / totalEmailJobs) * 100}%` }}
                      />
                    ))}
                  </View>
                  <View className="mt-4 gap-2">
                    {stats.statusStats.map((entry) => (
                      <View key={entry.status} className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <View
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: STATUS_DOT_COLORS[entry.status] }}
                          />
                          <Text className="text-gray-700 dark:text-neutral-300">{STATUS_LABELS[entry.status]}</Text>
                        </View>
                        <Text className="font-semibold text-gray-900 dark:text-neutral-50">{entry.count}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
}

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View className="w-[48%] gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <View className="size-9 items-center justify-center rounded-full bg-brand-100 dark:bg-neutral-800">{icon}</View>
      <Text className="text-xs text-gray-500 dark:text-neutral-400">{label}</Text>
      <Text className="text-lg font-bold text-gray-900 dark:text-neutral-50" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

type ComercialBarRowProps = {
  comercial: ComercialStat;
  isLeader: boolean;
  percentage: number;
};

function ComercialBarRow({ comercial, isLeader, percentage }: ComercialBarRowProps) {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1 flex-row items-center gap-1.5">
          {isLeader ? <Crown color={isDarkMode ? colors.brand400 : colors.brand700} size={14} /> : null}
          <Text className="flex-1 font-semibold text-gray-900 dark:text-neutral-50" numberOfLines={1}>
            {comercial.name}
          </Text>
        </View>
        <Text className="text-gray-500 dark:text-neutral-400">{comercial.count}</Text>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
        <View className="h-2 rounded-full bg-brand-600 dark:bg-brand-400" style={{ width: `${percentage}%` }} />
      </View>
    </View>
  );
}
