import { Image, StyleSheet, Platform, FlatList } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PrimaryTextInput } from "@/components/PrimaryTextInput";
import { SolidButton } from "@/components/SolidButton";
import { ToDoListCard } from "@/components/ToDoListCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLayoutEffect, useState } from "react";
import { router } from "expo-router";
import { useApi } from "@/hooks/useApi";

export default function ToDoScreen() {
  const { fetchTodos, createTodo } = useApi();

  const [token, setToken] = useState<string | null>(null);
  const [toDos, setToDos] = useState<[]>([]);
  const [toDoTitle, setToDoTitle] = useState<string>(``);

  useLayoutEffect(() => {
    handleGetToken();
  }, []);

  const handleGetToken = async () => {
    const token = await AsyncStorage.getItem("token");
    handleGetToDos(token);
    setToken(token);
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/", { relativeToDirectory: true });
  };

  const handleGetToDos = async (token: string) => {
    const response = await fetchTodos(token);
    setToDos(response?.tasks);
  };

  const handleCreateToDo = async () => {
    if (toDoTitle.trim() === "") {
      return alert(`ToDo title cannot be empty`);
    }

    try {
      setToDoTitle(``)
      await createTodo({ title: toDoTitle }, token);
      await handleGetToDos(token);

      alert(`ToDo creation successful`);
    } catch (error) {
      alert(error?.response?.data?.error || "An unexpected error occurred.");
    }
  };

  if (token === null) {
    return null;
  }

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
        <ThemedText type="title">Create ToDo!</ThemedText>
        <HelloWave />
      </ThemedView>

      <PrimaryTextInput
        placeholder={`Enter ToDo details...`}
        onChangeText={(val) => setToDoTitle(val)}
        value={toDoTitle}
      />

      <SolidButton onPress={handleCreateToDo} label="Submit Task" />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My ToDo's</ThemedText>
        <HelloWave />
      </ThemedView>

      {toDos.length > 0 ? (
        <FlatList
          data={toDos}
          renderItem={({ item, index }) => (
            <ToDoListCard data={item} index={index} />
          )}
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedText type="defaultSemiBold">No ToDo Available</ThemedText>
      )}
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
