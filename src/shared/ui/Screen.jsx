import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { colors } from "./theme.js";

export function Screen({ children, scroll = true }) {
  const Content = scroll ? ScrollView : SafeAreaView;
  return (
    <SafeAreaView style={styles.safe}>
      <Content contentContainerStyle={scroll ? styles.content : undefined} style={styles.flex}>
        {children}
      </Content>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 16,
  },
});
