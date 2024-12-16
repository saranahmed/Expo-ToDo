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
  const { fetchTodos, createTodo, deleteTodo, updateTodo } = useApi();

  const [token, setToken] = useState<string | null>(null);
  const [toDos, setToDos] = useState<[]>([]);
  const [toDoTitle, setToDoTitle] = useState<string>(``);
  const [toDoToUpdate, setToDoToUpdate] = useState<string | null>(null);

  useLayoutEffect(() => {
    handleGetToken();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/", { relativeToDirectory: true });
  };

  const handleGetToken = async () => {
    const token = await AsyncStorage.getItem("token");
    handleGetToDos(token);
    setToken(token);
  };

  const handleGetToDos = async (token: string) => {
    const response = await fetchTodos(token);
    setToDos(response?.tasks);
  };

  const handleCreateToDo = async () => {
    if (toDoTitle.trim() === "") {
      return alert(`ToDo title cannot be empty`);
    }
    setToDoTitle(``);
    await createTodo({ title: toDoTitle }, token);
    await handleGetToDos(token);
  };

  const handleDeleteToDo = async (idToDelete: string) => {
    setToDos((prevToDos) =>
      prevToDos.filter((todo) => todo._id !== idToDelete)
    );

    await deleteTodo(idToDelete, token);
  };

  const handleUpdateToDo = async () => {
    if (toDoTitle.trim() === "") {
      return alert("ToDo title cannot be empty");
    }

    setToDos((prevToDos) =>
      prevToDos.map((todo) =>
        todo._id === toDoToUpdate ? { ...todo, title: toDoTitle } : todo
      )
    );

    await updateTodo(toDoToUpdate, { title: toDoTitle }, token);

    setToDoToUpdate(null);
    setToDoTitle(``);
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

      <SolidButton
        onPress={toDoToUpdate === null ? handleCreateToDo : handleUpdateToDo}
        label={toDoToUpdate === null ? "Submit ToDo" : "Update ToDo"}
      />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My ToDo's</ThemedText>
        <HelloWave />
      </ThemedView>

      {toDos.length > 0 ? (
        <FlatList
          data={toDos}
          renderItem={({ item, index }) => (
            <ToDoListCard
              data={item}
              index={index}
              onDeletePress={() => handleDeleteToDo(item?._id)}
              onUpdatePress={() => {
                setToDoTitle(item?.title);
                setToDoToUpdate(item?._id);
              }}
            />
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
