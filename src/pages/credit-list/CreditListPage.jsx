import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency, formatDate } from "../../entities/credit/format.js";
import { listCredits } from "../../features/credits/api.js";
import { Banner } from "../../shared/ui/Banner.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Screen } from "../../shared/ui/Screen.jsx";
import { TextField } from "../../shared/ui/TextField.jsx";
import { colors } from "../../shared/ui/theme.js";

const defaultFilters = {
  clientName: "",
  clientDocument: "",
  salesperson: "",
  sortBy: "createdAt",
  direction: "desc",
};

export function CreditListPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [credits, setCredits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listCredits(filters);
      setCredits(response.items ?? []);
    } catch (err) {
      setCredits([]);
      setError(err.message || "No se pudieron cargar los créditos.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setValue = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  const toggleSort = (sortBy) => {
    setFilters((previous) => ({
      ...previous,
      sortBy,
      direction: previous.sortBy === sortBy && previous.direction === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <Screen scroll={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Consulta</Text>
        <Banner message={error} />
        <TextField label="Nombre cliente" value={filters.clientName} onChangeText={(value) => setValue("clientName", value)} />
        <TextField label="Cédula / ID" value={filters.clientDocument} onChangeText={(value) => setValue("clientDocument", value)} />
        <TextField label="Comercial" value={filters.salesperson} onChangeText={(value) => setValue("salesperson", value)} />
        <View style={styles.sortRow}>
          <SortChip active={filters.sortBy === "createdAt"} label={`Fecha ${filters.sortBy === "createdAt" ? filters.direction : ""}`} onPress={() => toggleSort("createdAt")} />
          <SortChip active={filters.sortBy === "amount"} label={`Valor ${filters.sortBy === "amount" ? filters.direction : ""}`} onPress={() => toggleSort("amount")} />
          <Button title="Actualizar" variant="outline" onPress={load} disabled={loading} />
        </View>
        {loading && credits.length === 0 ? <ActivityIndicator color={colors.primary} /> : null}
        <FlatList
          data={credits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay créditos activos para mostrar.</Text> : null}
          renderItem={({ item }) => <CreditCard item={item} />}
        />
      </View>
    </Screen>
  );
}

function SortChip({ active, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function CreditCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.clientName}</Text>
      <Text style={styles.meta}>{item.clientDocument} · {item.salespersonName}</Text>
      <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      <Text style={styles.meta}>{item.termMonths} meses · {item.interestRate}% · {formatDate(item.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 18,
    gap: 12,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "900",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontWeight: "800",
  },
  chipTextActive: {
    color: "#fff",
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  empty: {
    color: colors.muted,
    textAlign: "center",
    padding: 18,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  meta: {
    color: colors.muted,
  },
  amount: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
  },
});
