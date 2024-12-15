import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PrimaryTextInput } from "@/components/PrimaryTextInput";
import { SolidButton } from "@/components/SolidButton";
import { ToDoListCard } from "@/components/ToDoListCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLayoutEffect } from "react";
import { router } from "expo-router";

export default function ToDoScreen() {
  useLayoutEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");

    console.log(token, "value");
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");

    router.replace("/", { relativeToDirectory: true });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <SolidButton onPress={handleSignOut} label="Sign Out" />

      <ThemedView style={{ ...styles.titleContainer, marginTop: 24 }}>
        <ThemedText type="title">ToDo!</ThemedText>
        <HelloWave />
      </ThemedView>

      <PrimaryTextInput
        placeholder={`Enter task details...`}
        // onChangeText={field.onChange(name)}
        // value={field.value}
        // onBlur={field.onBlur(name)}
        // secureTextEntry={secureTextEntry}
      />

      <SolidButton
        //  onPress={handleLogin}
        label="Submit Task"
      />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Tasks</ThemedText>
        <HelloWave />
      </ThemedView>

      <ToDoListCard />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
