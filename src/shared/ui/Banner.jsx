import { StyleSheet, Text } from "react-native";
import { colors } from "./theme.js";

export function Banner({ message, type = "error" }) {
  if (!message) return null;
  const success = type === "success";
  return <Text style={[styles.banner, success ? styles.success : styles.error]}>{message}</Text>;
}

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    borderRadius: 8,
    fontWeight: "800",
  },
  error: {
    color: colors.danger,
    backgroundColor: "#fff1ef",
  },
  success: {
    color: colors.success,
    backgroundColor: "#eaf8ee",
  },
});
