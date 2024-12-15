import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

interface SolidButtonProps {
  label: string;
  onPress: () => void;
}

export function SolidButton({ label, onPress }: SolidButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <ThemedText type="defaultSemiBold" style={{color:'#777'}}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.dark.icon,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
