import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused?: boolean;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
  activeBorderColor?: string;
  inactiveBorderColor?: string;
};

export default function TabBarIcon({
  name,
  color,
  focused = false,
  activeBackgroundColor = "#f0983e",
  inactiveBackgroundColor = "transparent",
  activeBorderColor = "#f0983e",
  inactiveBorderColor = "transparent",
}: Props) {
  return (
    <View
      style={[
        styles.iconWrap,
        {
          backgroundColor: focused
            ? activeBackgroundColor
            : inactiveBackgroundColor,
          borderColor: focused ? activeBorderColor : inactiveBorderColor,
        },
      ]}
    >
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
});
