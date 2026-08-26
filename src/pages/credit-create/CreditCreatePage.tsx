import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { type CreditFormValues, validateCredit } from "@/entities/credit/validation";
import { createCredit } from "@/features/credits/api";
import { Banner, Button, Screen, TextField, colors } from "@/shared/ui";

type CreditCreatePageProps = NativeStackScreenProps<RootStackParamList, "CreditCreate">;

const initialValues: CreditFormValues = {
  clientName: "",
  clientDocument: "",
  amount: "",
  interestRate: "2",
  termMonths: "",
  salespersonName: "",
};

export function CreditCreatePage({ navigation }: CreditCreatePageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CreditFormValues, string>>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setValue = (key: keyof CreditFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  };

  const submit = async () => {
    const validation = validateCredit(values);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await createCredit(validation.value);
      setValues(initialValues);
      setMessage("Crédito registrado. La notificación quedó en cola.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el crédito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
      <Screen contentClassName="pb-8">
        <View className="relative my-2 flex justify-center py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
            <ArrowLeft color={isDarkMode ? colors.violet400 : colors.violet700} size={24} />
          </TouchableOpacity>
          <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Registrar crédito</Text>
        </View>

        <View className="pb-4 pt-3">
          <Text className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Nuevo crédito</Text>
          <Text className="mt-2 text-gray-500 dark:text-neutral-400">La fecha oficial la genera el backend.</Text>
        </View>

        <View className="gap-4">
          <Banner message={error} />
          <Banner message={message} type="success" />
          <TextField label="Nombre del cliente" value={values.clientName} onChangeText={(value) => setValue("clientName", value)} error={errors.clientName} />
          <TextField label="Cédula o ID" value={values.clientDocument} onChangeText={(value) => setValue("clientDocument", value)} keyboardType="number-pad" error={errors.clientDocument} />
          <TextField label="Valor del crédito" value={values.amount} onChangeText={(value) => setValue("amount", value)} keyboardType="numeric" error={errors.amount} />
          <TextField label="Tasa de interés" value={values.interestRate} onChangeText={(value) => setValue("interestRate", value)} keyboardType="numeric" error={errors.interestRate} />
          <TextField label="Plazo en meses" value={values.termMonths} onChangeText={(value) => setValue("termMonths", value)} keyboardType="numeric" error={errors.termMonths} />
          <TextField label="Comercial" value={values.salespersonName} onChangeText={(value) => setValue("salespersonName", value)} error={errors.salespersonName} />
          <Button
            title="Registrar crédito"
            loading={loading}
            onPress={submit}
            icon={!loading ? <CheckCircle2 color={colors.white} size={18} /> : undefined}
            className="mt-2"
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
