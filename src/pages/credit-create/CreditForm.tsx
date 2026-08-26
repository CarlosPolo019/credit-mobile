import { CheckCircle2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { View } from "react-native";
import type { CreditPayload } from "@/entities/credit/types";
import { type CreditFormValues, validateCredit } from "@/entities/credit/validation";
import { Banner, BottomSheetModal, type BottomSheetModalRef, Button, TextField, colors } from "@/shared/ui";
import { CreditConfirmSheetContent } from "./CreditConfirmSheetContent";

const emptyValues: CreditFormValues = {
  clientFirstName: "",
  clientSecondName: "",
  clientFirstSurname: "",
  clientSecondSurname: "",
  clientDocument: "",
  amount: "",
  interestRate: "2",
  termMonths: "",
};

type CreditFormProps = {
  mode: "create" | "edit";
  initialValues?: CreditFormValues;
  salespersonLabel: string;
  onSubmit: (payload: CreditPayload) => Promise<boolean>;
};

/**
 * Client/condition fields + confirmation-sheet flow shared by "registrar
 * crédito" and "editar crédito" — same shape as credit-web's
 * CreditForm.jsx (mode-aware, single component instead of two near
 * duplicates).
 */
export function CreditForm({ mode, initialValues, salespersonLabel, onSubmit }: CreditFormProps) {
  const isEdit = mode === "edit";
  const [values, setValues] = useState<CreditFormValues>(initialValues ?? emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CreditFormValues, string>>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Holds the validated payload while the operator reviews the confirmation
  // sheet; null means "no confirmation pending", not "empty form".
  const [pendingCredit, setPendingCredit] = useState<CreditPayload | null>(null);
  const confirmSheetRef = useRef<BottomSheetModalRef>(null);

  const setValue = (key: keyof CreditFormValues, value: string) => {
    const nextValue = key === "clientDocument" ? value.replace(/\D/g, "") : value;
    setValues((previous) => ({ ...previous, [key]: nextValue }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  };

  const review = () => {
    const validation = validateCredit(values);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setError("");
    setPendingCredit(validation.value);
    confirmSheetRef.current?.present();
  };

  const confirm = async () => {
    if (!pendingCredit) return;
    setLoading(true);
    const ok = await onSubmit(pendingCredit);
    confirmSheetRef.current?.dismiss();
    setLoading(false);
    if (!ok) {
      setError(isEdit ? "No se pudo guardar el crédito." : "No se pudo registrar el crédito.");
      return;
    }
    if (!isEdit) {
      setValues(emptyValues);
      setErrors({});
    }
  };

  return (
    <>
      <View className="gap-4">
        <Banner message={error} />
        <TextField label="Cédula o ID" value={values.clientDocument} onChangeText={(value) => setValue("clientDocument", value)} keyboardType="number-pad" error={errors.clientDocument} autoFocus={!isEdit} />
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
          title={isEdit ? "Guardar cambios" : "Registrar crédito"}
          onPress={review}
          icon={<CheckCircle2 color={colors.ink} size={18} />}
          className="mt-2"
        />
      </View>

      <BottomSheetModal ref={confirmSheetRef}>
        {pendingCredit ? (
          <CreditConfirmSheetContent
            credit={pendingCredit}
            salespersonLabel={salespersonLabel}
            mode={mode}
            onCancel={() => confirmSheetRef.current?.dismiss()}
            onConfirm={confirm}
            isSubmitting={loading}
          />
        ) : null}
      </BottomSheetModal>
    </>
  );
}
