import { Image, Text, View } from "react-native";

const PALETTE = [
  { bg: "#00D280", color: "#052224" },
  { bg: "#052224", color: "#FFFFFF" },
  { bg: "#0D9488", color: "#FFFFFF" },
  { bg: "#047857", color: "#FFFFFF" },
];

// Same three seeded people credit-web has real photos for
// (public/people/*.jpg there) — anyone else falls back to initials on a
// color swatch, matching that behavior exactly.
const PERSON_IMAGES: Record<string, ReturnType<typeof require>> = {
  "adriana castellano": require("../../../assets/images/people/adriana-castellano.jpg"),
  "carlos escorcia": require("../../../assets/images/people/carlos-escorcia.jpg"),
  "jennifer navarro": require("../../../assets/images/people/jennifer-navarro.jpg"),
};

function normalizeName(name?: string) {
  return String(name ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function initials(name?: string) {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function swatchFor(name?: string) {
  const key = String(name ?? "");
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % PALETTE.length;
  }
  return PALETTE[hash];
}

function imageFor(name?: string) {
  return PERSON_IMAGES[normalizeName(name)];
}

type PersonAvatarProps = {
  name?: string;
  size?: number;
};

export function PersonAvatar({ name, size = 32 }: PersonAvatarProps) {
  const swatch = swatchFor(name);
  const image = imageFor(name);

  if (image) {
    return (
      <Image
        source={image}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: swatch.bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: swatch.color, fontSize: size * 0.4, fontWeight: "700" }}>{initials(name)}</Text>
    </View>
  );
}

type PersonChipProps = {
  name?: string;
  size?: number;
  secondaryText?: string;
};

export function PersonChip({ name, size = 32, secondaryText }: PersonChipProps) {
  if (!name) return <Text className="text-gray-500 dark:text-neutral-400">-</Text>;
  return (
    <View className="flex-row items-center gap-3">
      <PersonAvatar name={name} size={size} />
      <View>
        <Text className="font-semibold text-gray-900 dark:text-neutral-50">{name}</Text>
        {secondaryText ? <Text className="text-xs text-gray-500 dark:text-neutral-400">{secondaryText}</Text> : null}
      </View>
    </View>
  );
}
