import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/navigation";
import type { CreditFormValues } from "@/entities/credit/validation";
import type { CreditPayload } from "@/entities/credit/types";
import { getCredit, updateCredit } from "@/features/credits/api";
import { CreditForm } from "@/pages/credit-create/CreditForm";
import { ErrorMessage, Screen, colors } from "@/shared/ui";

type CreditEditPageProps = NativeStackScreenProps<RootStackParamList, "CreditEdit">;

export function CreditEditPage({ navigation, route }: CreditEditPageProps) {
  const { creditId } = route.params;
  const isDarkMode = useColorScheme() === "dark";
  const [initialValues, setInitialValues] = useState<CreditFormValues | null>(null);
  const [salespersonLabel, setSalespersonLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const credit = await getCredit(creditId);
      setInitialValues({
        clientFirstName: credit.clientFirstName ?? "",
        clientSecondName: credit.clientSecondName ?? "",
        clientFirstSurname: credit.clientFirstSurname ?? "",
        clientSecondSurname: credit.clientSecondSurname ?? "",
        clientDocument: credit.clientDocument,
        amount: String(credit.amount),
        interestRate: String(credit.interestRate),
        termMonths: String(credit.termMonths),
      });
      setSalespersonLabel(credit.salespersonName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el crédito.");
    } finally {
      setLoading(false);
    }
  }, [creditId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (payload: CreditPayload) => {
    try {
      await updateCredit(creditId, payload);
      navigation.goBack();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Screen contentClassName="pb-10">
      <View className="relative my-2 flex justify-center py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
          <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Editar crédito</Text>
      </View>

      {loading ? (
        <ActivityIndicator className="py-8" color={isDarkMode ? colors.brand400 : colors.brand700} />
      ) : error && !initialValues ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : initialValues ? (
        <CreditForm mode="edit" initialValues={initialValues} salespersonLabel={salespersonLabel} onSubmit={handleSubmit} />
      ) : null}
    </Screen>
  );
}
