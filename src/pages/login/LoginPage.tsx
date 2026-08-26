import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { useSession } from "@/entities/session/SessionContext";
import { Banner, Button, Screen, TextField } from "@/shared/ui";

type LoginPageProps = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginPage({ navigation }: LoginPageProps) {
  const { login } = useSession();
  const [values, setValues] = useState({ document: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setValue = (key: "document" | "password", value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      await login(values.document.trim(), values.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
      <Screen contentClassName="flex-grow justify-center pb-10">
        <View className="pb-8">
          <Text className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
            Fya Social Capital
          </Text>
          <Text className="mt-2 text-4xl font-bold text-gray-900 dark:text-neutral-50">Créditos</Text>
          <Text className="mt-3 text-base text-gray-500 dark:text-neutral-400">Ingreso con cédula registrada.</Text>
        </View>

        <View className="gap-4">
          <Banner message={error} />
          <TextField
            label="Cédula"
            value={values.document}
            onChangeText={(value) => setValue("document", value)}
            keyboardType="number-pad"
            autoCapitalize="none"
          />
          <TextField label="Clave" value={values.password} onChangeText={(value) => setValue("password", value)} secureTextEntry />
          <Button title="Ingresar" loading={loading} onPress={submit} className="mt-2" />
          <TouchableOpacity onPress={() => navigation.navigate("Register")} activeOpacity={0.6} className="items-center py-3">
            <Text className="text-sm font-semibold text-violet-700 dark:text-violet-400">Crear cuenta con cédula</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
