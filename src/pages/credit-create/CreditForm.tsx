import { CheckCircle2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Client, CreditEstimate, CreditPayload } from "@/entities/credit/types";
import { type CreditFormValues, creditLimits, validateCredit } from "@/entities/credit/validation";
import { estimateCredit, listClients } from "@/features/credits/api";
import { useNetworkStatus } from "@/shared/network/NetworkStatusContext";
import { Banner, BottomSheetModal, type BottomSheetModalRef, Button, TextField, colors } from "@/shared/ui";
import { CreditConfirmSheetContent } from "./CreditConfirmSheetContent";

const MAX_SUGGESTIONS = 5;

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
  const { isOnline } = useNetworkStatus();
  const [values, setValues] = useState<CreditFormValues>(initialValues ?? emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CreditFormValues, string>>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Holds the validated payload while the operator reviews the confirmation
  // sheet; null means "no confirmation pending", not "empty form".
  const [pendingCredit, setPendingCredit] = useState<CreditPayload | null>(null);
  const [estimate, setEstimate] = useState<CreditEstimate | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const confirmSheetRef = useRef<BottomSheetModalRef>(null);

  // Only the create flow benefits from the autocomplete — an existing
  // credit's client is already identified, editing stays as-is.
  useEffect(() => {
    if (isEdit) return;
    let cancelled = false;
    listClients()
      .then((items) => {
        if (!cancelled) setClients(items ?? []);
      })
      .catch(() => {
        // Non-fatal: the field just behaves as a plain text input.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suggestions =
    !isEdit && !selectedClient && values.clientDocument.length > 0
      ? clients.filter((client) => client.document.includes(values.clientDocument)).slice(0, MAX_SUGGESTIONS)
      : [];

  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setValues((previous) => ({
      ...previous,
      clientDocument: client.document,
      clientFirstName: client.firstName || "",
      clientSecondName: client.secondName || "",
      clientFirstSurname: client.firstSurname || "",
      clientSecondSurname: client.secondSurname || "",
    }));
    setErrors((previous) => ({
      ...previous,
      clientDocument: "",
      clientFirstName: "",
      clientSecondName: "",
      clientFirstSurname: "",
      clientSecondSurname: "",
    }));
  };

  const setValue = (key: keyof CreditFormValues, value: string) => {
    const nextValue = key === "clientDocument" ? value.replace(/\D/g, "") : value;
    if (key === "clientDocument" && selectedClient) {
      setSelectedClient(null);
      setValues((previous) => ({
        ...previous,
        clientDocument: nextValue,
        clientFirstName: "",
        clientSecondName: "",
        clientFirstSurname: "",
        clientSecondSurname: "",
      }));
      setErrors((previous) => ({ ...previous, clientDocument: "" }));
      return;
    }
    setValues((previous) => ({ ...previous, [key]: nextValue }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  };

  // Digits-only, clamped to the max so it's impossible to end up with a
  // value the backend would reject anyway — same idea as an input mask,
  // mirrors credit-web's CreditForm.jsx. Stored as plain digits (no "."
  // formatting) so validateCredit/estimateCredit keep getting exactly what
  // they got before.
  const setAmount = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const nextValue = digits === "" ? "" : String(Math.min(Number(digits), creditLimits.maxAmount));
    setValues((previous) => ({ ...previous, amount: nextValue }));
    setErrors((previous) => ({ ...previous, amount: "" }));
  };

  const setTermMonths = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const nextValue = digits === "" ? "" : String(Math.min(Number(digits), creditLimits.maxTermMonths));
    setValues((previous) => ({ ...previous, termMonths: nextValue }));
    setErrors((previous) => ({ ...previous, termMonths: "" }));
  };

  const setInterestRate = (value: string) => {
    let cleaned = value.replace(/[^\d.]/g, "");
    const firstDot = cleaned.indexOf(".");
    if (firstDot !== -1) {
      cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
    }
    // A trailing "." (or an empty field) is a mid-typing state — don't
    // clamp yet, or "3." would jump to "3.5" before the decimals land.
    if (cleaned !== "" && !cleaned.endsWith(".")) {
      const numeric = Number(cleaned);
      if (Number.isFinite(numeric) && numeric > creditLimits.maxInterestRate) {
        cleaned = String(creditLimits.maxInterestRate);
      }
    }
    setValues((previous) => ({ ...previous, interestRate: cleaned }));
    setErrors((previous) => ({ ...previous, interestRate: "" }));
  };

  const review = async () => {
    const validation = validateCredit(values);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setError("");
    if (!isEdit && !isOnline) {
      setEstimate(null);
      setPendingCredit(validation.value);
      confirmSheetRef.current?.present();
      return;
    }
    setIsEstimating(true);
    try {
      const response = await estimateCredit(validation.value);
      setEstimate(response);
      setPendingCredit(validation.value);
      confirmSheetRef.current?.present();
    } catch {
      setError("No se pudo calcular la cuota estimada.");
    } finally {
      setIsEstimating(false);
    }
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
      setSelectedClient(null);
    }
  };

  return (
    <>
      <View className="gap-4">
        <Banner message={error} />
        <View className="gap-2">
          <TextField
            label="Cédula o ID"
            value={values.clientDocument}
            onChangeText={(value) => setValue("clientDocument", value)}
            keyboardType="number-pad"
            error={errors.clientDocument}
            autoFocus={!isEdit}
          />
          {suggestions.length > 0 ? (
            <View className="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800">
              {suggestions.map((client, index) => (
                <TouchableOpacity
                  key={client.document}
                  onPress={() => selectClient(client)}
                  activeOpacity={0.6}
                  className={`bg-white px-3 py-3 dark:bg-neutral-950 ${
                    index < suggestions.length - 1 ? "border-b border-gray-100 dark:border-neutral-900" : ""
                  }`}
                >
                  <Text className="text-sm font-semibold text-gray-900 dark:text-neutral-50">{client.document}</Text>
                  <Text className="text-sm text-gray-500 dark:text-neutral-400">{client.fullName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
          {!isEdit && selectedClient ? (
            <Text className="text-xs text-gray-500 dark:text-neutral-400">
              Cliente encontrado — el nombre se completó solo.
            </Text>
          ) : null}
        </View>
        <View className="flex-row gap-3">
          <TextField className="flex-1" label="Primer nombre" value={values.clientFirstName} onChangeText={(value) => setValue("clientFirstName", value)} error={errors.clientFirstName} editable={!selectedClient} />
          <TextField className="flex-1" label="Segundo nombre" value={values.clientSecondName} onChangeText={(value) => setValue("clientSecondName", value)} error={errors.clientSecondName} editable={!selectedClient} />
        </View>
        <View className="flex-row gap-3">
          <TextField className="flex-1" label="Primer apellido" value={values.clientFirstSurname} onChangeText={(value) => setValue("clientFirstSurname", value)} error={errors.clientFirstSurname} editable={!selectedClient} />
          <TextField className="flex-1" label="Segundo apellido" value={values.clientSecondSurname} onChangeText={(value) => setValue("clientSecondSurname", value)} error={errors.clientSecondSurname} editable={!selectedClient} />
        </View>
        <TextField
          label="Valor del crédito"
          value={values.amount ? Number(values.amount).toLocaleString("es-CO") : ""}
          onChangeText={setAmount}
          keyboardType="numeric"
          prefix="$"
          error={errors.amount}
          helperText={`Máximo ${creditLimits.maxAmount.toLocaleString("es-CO")}`}
        />
        <View className="flex-row gap-3">
          <TextField
            className="flex-1"
            label="Tasa de interés (%)"
            value={values.interestRate}
            onChangeText={setInterestRate}
            keyboardType="numeric"
            error={errors.interestRate}
            helperText={`Entre ${creditLimits.minInterestRate}% y ${creditLimits.maxInterestRate}%`}
          />
          <TextField
            className="flex-1"
            label="Plazo (meses)"
            value={values.termMonths}
            onChangeText={setTermMonths}
            keyboardType="numeric"
            error={errors.termMonths}
            helperText={`Entre ${creditLimits.minTermMonths} y ${creditLimits.maxTermMonths} meses`}
          />
        </View>
        <Button
          title={isEdit ? "Guardar cambios" : "Registrar crédito"}
          onPress={review}
          loading={isEstimating}
          icon={<CheckCircle2 color={colors.ink} size={18} />}
          className="mt-2"
        />
      </View>

      <BottomSheetModal ref={confirmSheetRef}>
        {pendingCredit ? (
          <CreditConfirmSheetContent
            credit={pendingCredit}
            monthlyPayment={estimate?.monthlyPayment ?? null}
            totalToPay={estimate?.totalToPay ?? null}
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
