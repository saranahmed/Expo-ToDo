import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";
import { Colors } from "@/constants/Colors";

interface PrimaryTextInputProps extends TextInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  value: string;
}

export function PrimaryTextInput({
  placeholder = "",
  onChangeText,
  secureTextEntry = false,
  value,
  ...rest
}: PrimaryTextInputProps) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      style={styles.input}
      numberOfLines={1}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={'#777'}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.dark.icon,
    paddingHorizontal: 12,
    paddingVertical:12,
    borderRadius:8,
    color:"#777"
  },
});
