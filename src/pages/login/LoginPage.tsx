import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { useSession } from "@/entities/session/SessionContext";
import { Banner, Button, Screen, TextField } from "@/shared/ui";

type LoginPageProps = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginPage({ navigation }: LoginPageProps) {
  const { login } = useSession();
  const [values, setValues] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setValue = (key: "username" | "password", value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      await login(values.username.trim(), values.password);
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
          <View className="flex-row items-center gap-2">
            <Image source={require("../../../assets/images/fya-mark.png")} className="h-6 w-6" resizeMode="contain" />
            <Text className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              Fya Social Capital
            </Text>
          </View>
          <Text className="mt-2 text-4xl font-bold text-gray-900 dark:text-neutral-50">Créditos</Text>
          <Text className="mt-3 text-base text-gray-500 dark:text-neutral-400">Ingreso con identificador y clave.</Text>
        </View>

        <View className="gap-4">
          <Banner message={error} />
          <TextField
            label="Identificador"
            value={values.username}
            onChangeText={(value) => setValue("username", value)}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Cédula o usuario demo"
          />
          <TextField label="Clave" value={values.password} onChangeText={(value) => setValue("password", value)} secureTextEntry />
          <Button title="Ingresar" loading={loading} onPress={submit} className="mt-2" />
          <TouchableOpacity onPress={() => navigation.navigate("Register")} activeOpacity={0.6} className="items-center py-3">
            <Text className="text-sm font-semibold text-brand-700 dark:text-brand-400">Crear cuenta con cédula</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
