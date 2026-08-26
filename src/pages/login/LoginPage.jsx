import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSession } from "../../entities/session/SessionContext.jsx";
import { Banner } from "../../shared/ui/Banner.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Screen } from "../../shared/ui/Screen.jsx";
import { TextField } from "../../shared/ui/TextField.jsx";
import { colors } from "../../shared/ui/theme.js";

export function LoginPage() {
  const { login } = useSession();
  const [values, setValues] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setValue = (key, value) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      await login(values.username.trim(), values.password);
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Fya Social Capital</Text>
        <Text style={styles.title}>Créditos</Text>
        <Text style={styles.copy}>Ingreso operativo para registrar y consultar créditos.</Text>
      </View>
      <Banner message={error} />
      <TextField label="Usuario" value={values.username} onChangeText={(value) => setValue("username", value)} autoCapitalize="none" />
      <TextField label="Contraseña" value={values.password} onChangeText={(value) => setValue("password", value)} secureTextEntry />
      <Button title="Ingresar" loading={loading} onPress={submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 18,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  kicker: {
    color: colors.accent,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "900",
  },
  copy: {
    color: colors.muted,
  },
});
