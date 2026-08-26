import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text } from "react-native";
import { colors } from "@/shared/ui";

type SplashProps = {
  onFinish: () => void;
};

/**
 * Branded splash shown while the JS bundle boots and the session restores.
 * Uses RN's built-in Animated API (no Reanimated/bootsplash) to avoid adding
 * a native dependency just for this.
 */
export function Splash({ onFinish }: SplashProps) {
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0.35)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(ringScale, { toValue: 1.6, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(ringOpacity, { toValue: 0, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          ]),
          Animated.timing(ringScale, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.35, duration: 0, useNativeDriver: true }),
        ]),
        { iterations: 2 },
      ),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(onFinish);
    }, 1300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.View style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <Image source={require("../../assets/images/fya-mark.png")} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Text style={styles.wordmark}>Fya Social Capital</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  ring: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: colors.brand600,
  },
  logo: {
    width: 72,
    height: 72,
  },
  wordmark: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.brand400,
  },
});
