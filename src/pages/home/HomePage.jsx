import { StyleSheet, Text, View } from "react-native";
import { useSession } from "../../entities/session/SessionContext.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Screen } from "../../shared/ui/Screen.jsx";
import { colors } from "../../shared/ui/theme.js";

export function HomePage({ navigation }) {
  const { session, logout } = useSession();
  return (
    <Screen>
      <View style={styles.panel}>
        <Text style={styles.kicker}>Panel operativo</Text>
        <Text style={styles.title}>Créditos</Text>
        <Text style={styles.copy}>Sesión activa: {session?.user?.username ?? "Usuario"}</Text>
      </View>
      <Button title="Registrar crédito" onPress={() => navigation.navigate("CreditCreate")} />
      <Button title="Consultar créditos" variant="outline" onPress={() => navigation.navigate("CreditList")} />
      <Button title="Cerrar sesión" variant="outline" onPress={logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: 18,
    borderRadius: 8,
    backgroundColor: colors.primary,
    gap: 4,
  },
  kicker: {
    color: "#f3d27a",
    fontWeight: "900",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
  },
  copy: {
    color: "#d9efeb",
  },
});
