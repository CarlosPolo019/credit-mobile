import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { validateCredit } from "../../entities/credit/validation.js";
import { createCredit } from "../../features/credits/api.js";
import { Banner } from "../../shared/ui/Banner.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Screen } from "../../shared/ui/Screen.jsx";
import { TextField } from "../../shared/ui/TextField.jsx";
import { colors } from "../../shared/ui/theme.js";

const initialValues = {
  clientName: "",
  clientDocument: "",
  amount: "",
  interestRate: "2",
  termMonths: "",
  salespersonName: "",
};

export function CreditCreatePage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setValue = (key, value) => {
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
      setError(err.message || "No se pudo registrar el crédito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
      <Screen>
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo crédito</Text>
          <Text style={styles.copy}>La fecha oficial la genera el backend.</Text>
        </View>
        <Banner message={error} />
        <Banner message={message} type="success" />
        <TextField label="Nombre del cliente" value={values.clientName} onChangeText={(value) => setValue("clientName", value)} error={errors.clientName} />
        <TextField label="Cédula o ID" value={values.clientDocument} onChangeText={(value) => setValue("clientDocument", value)} error={errors.clientDocument} />
        <TextField label="Valor del crédito" value={values.amount} onChangeText={(value) => setValue("amount", value)} keyboardType="numeric" error={errors.amount} />
        <TextField label="Tasa de interés" value={values.interestRate} onChangeText={(value) => setValue("interestRate", value)} keyboardType="numeric" error={errors.interestRate} />
        <TextField label="Plazo en meses" value={values.termMonths} onChangeText={(value) => setValue("termMonths", value)} keyboardType="numeric" error={errors.termMonths} />
        <TextField label="Comercial" value={values.salespersonName} onChangeText={(value) => setValue("salespersonName", value)} error={errors.salespersonName} />
        <Button title="Registrar crédito" loading={loading} onPress={submit} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    gap: 4,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "900",
  },
  copy: {
    color: colors.muted,
  },
});
