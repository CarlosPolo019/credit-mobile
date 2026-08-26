import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import type { RootStackParamList } from "@/app/AppRouter";
import { useSession } from "@/entities/session/SessionContext";
import { Banner, Button, Screen, TextField, colors } from "@/shared/ui";

type RegisterPageProps = NativeStackScreenProps<RootStackParamList, "Register">;

type RegisterValues = {
  fullName: string;
  document: string;
  password: string;
  confirmPassword: string;
};

const initialValues: RegisterValues = {
  fullName: "",
  document: "",
  password: "",
  confirmPassword: "",
};

export function RegisterPage({ navigation }: RegisterPageProps) {
  const isDarkMode = useColorScheme() === "dark";
  const { register } = useSession();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterValues, string>>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setValue = (key: keyof RegisterValues, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof RegisterValues, string>> = {};
    const fullName = values.fullName.trim().replace(/\s+/g, " ");
    const document = values.document.trim();
    if (!fullName) nextErrors.fullName = "El nombre es obligatorio.";
    if (!document) nextErrors.document = "La cédula es obligatoria.";
    if (values.password.length < 8) nextErrors.password = "La clave debe tener mínimo 8 caracteres.";
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = "Las claves no coinciden.";
    setErrors(nextErrors);
    return { isValid: Object.keys(nextErrors).length === 0, fullName, document };
  };

  const submit = async () => {
    const result = validate();
    if (!result.isValid) return;
    setError("");
    setLoading(true);
    try {
      await register(result.fullName, result.document, values.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
      <Screen contentClassName="pb-8">
        <View className="relative my-2 flex justify-center py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} className="absolute -left-3 z-10 p-3">
            <ArrowLeft color={isDarkMode ? colors.brand400 : colors.brand700} size={24} />
          </TouchableOpacity>
          <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">Crear cuenta</Text>
        </View>

        <View className="pb-6 pt-3">
          <Text className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Registro operativo</Text>
          <Text className="mt-2 text-gray-500 dark:text-neutral-400">La cédula será tu identificador de ingreso.</Text>
        </View>

        <View className="gap-4">
          <Banner message={error} />
          <TextField label="Nombre completo" value={values.fullName} onChangeText={(value) => setValue("fullName", value)} error={errors.fullName} autoCapitalize="words" />
          <TextField label="Cédula" value={values.document} onChangeText={(value) => setValue("document", value)} error={errors.document} keyboardType="number-pad" autoCapitalize="none" />
          <TextField label="Clave" value={values.password} onChangeText={(value) => setValue("password", value)} error={errors.password} secureTextEntry />
          <TextField label="Confirmar clave" value={values.confirmPassword} onChangeText={(value) => setValue("confirmPassword", value)} error={errors.confirmPassword} secureTextEntry />
          <Button title="Crear cuenta" loading={loading} onPress={submit} className="mt-2" />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
