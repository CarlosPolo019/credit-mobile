import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import type { CreditPayload } from "@/entities/credit/types";
import { type CreditFormValues, validateCredit } from "@/entities/credit/validation";
import { useSession } from "@/entities/session/SessionContext";
import { createCredit } from "@/features/credits/api";
import { Banner, BottomSheetModal, type BottomSheetModalRef, Button, Screen, TextField, colors } from "@/shared/ui";
import { CreditConfirmSheetContent } from "./CreditConfirmSheetContent";

type CreditCreatePageProps = NativeStackScreenProps<RootStackParamList, "CreditCreate">;

const initialValues: CreditFormValues = {
  clientFirstName: "",
  clientSecondName: "",
  clientFirstSurname: "",
  clientSecondSurname: "",
  clientDocument: "",
  amount: "",
  interestRate: "2",
  termMonths: "",
};

export function CreditCreatePage({ navigation }: CreditCreatePageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { session } = useSession();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CreditFormValues, string>>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Holds the validated payload while the operator reviews the confirmation
  // sheet; null means "no confirmation pending", not "empty form".
  const [pendingCredit, setPendingCredit] = useState<CreditPayload | null>(null);
  const confirmSheetRef = useRef<BottomSheetModalRef>(null);
  const salespersonLabel = session?.user.fullName || session?.user.document || session?.user.username || "";

  const setValue = (key: keyof CreditFormValues, value: string) => {
    const nextValue = key === "clientDocument" ? value.replace(/\D/g, "") : value;
    setValues((previous) => ({ ...previous, [key]: nextValue }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  };

  const reviewCredit = () => {
    const validation = validateCredit(values);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setError("");
    setMessage("");
    setPendingCredit(validation.value);
    confirmSheetRef.current?.present();
  };

  const confirmCredit = async () => {
    if (!pendingCredit) return;
    setLoading(true);
    try {
      await createCredit(pendingCredit);
      confirmSheetRef.current?.dismiss();
      setValues(initialValues);
      setMessage("Crédito registrado. La notificación quedó en cola.");
    } catch (err) {
      confirmSheetRef.current?.dismiss();
      setError(err instanceof Error ? err.message : "No se pudo registrar el crédito.");
    } finally {
      setLoading(false);
      // Not clearing pendingCredit here: the sheet is mid-close-animation and
      // unmounting its content early would flash an empty sheet. It gets
      // overwritten the next time the operator reviews a credit.
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
      <Screen contentClassName="pb-8">
        <View className="relative my-2 flex justify-center py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
            <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
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
          <TextField label="Cédula o ID" value={values.clientDocument} onChangeText={(value) => setValue("clientDocument", value)} keyboardType="number-pad" error={errors.clientDocument} autoFocus />
          <View className="flex-row gap-3">
            <TextField className="flex-1" label="Primer nombre" value={values.clientFirstName} onChangeText={(value) => setValue("clientFirstName", value)} error={errors.clientFirstName} />
            <TextField className="flex-1" label="Segundo nombre" value={values.clientSecondName} onChangeText={(value) => setValue("clientSecondName", value)} error={errors.clientSecondName} />
          </View>
          <View className="flex-row gap-3">
            <TextField className="flex-1" label="Primer apellido" value={values.clientFirstSurname} onChangeText={(value) => setValue("clientFirstSurname", value)} error={errors.clientFirstSurname} />
            <TextField className="flex-1" label="Segundo apellido" value={values.clientSecondSurname} onChangeText={(value) => setValue("clientSecondSurname", value)} error={errors.clientSecondSurname} />
          </View>
          <TextField label="Valor del crédito" value={values.amount} onChangeText={(value) => setValue("amount", value)} keyboardType="numeric" error={errors.amount} />
          <View className="flex-row gap-3">
            <TextField className="flex-1" label="Tasa de interés (%)" value={values.interestRate} onChangeText={(value) => setValue("interestRate", value)} keyboardType="numeric" error={errors.interestRate} />
            <TextField className="flex-1" label="Plazo (meses)" value={values.termMonths} onChangeText={(value) => setValue("termMonths", value)} keyboardType="numeric" error={errors.termMonths} />
          </View>
          <Button
            title="Registrar crédito"
            onPress={reviewCredit}
            icon={<CheckCircle2 color={colors.ink} size={18} />}
            className="mt-2"
          />
        </View>
      </Screen>

      <BottomSheetModal ref={confirmSheetRef}>
        {pendingCredit ? (
          <CreditConfirmSheetContent
            credit={pendingCredit}
            salespersonLabel={salespersonLabel}
            onCancel={() => confirmSheetRef.current?.dismiss()}
            onConfirm={confirmCredit}
            isSubmitting={loading}
          />
        ) : null}
      </BottomSheetModal>
    </KeyboardAvoidingView>
  );
}
