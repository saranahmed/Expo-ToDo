import { Image, StyleSheet, FlatList } from "react-native";
import { useLayoutEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PrimaryTextInput } from "@/components/PrimaryTextInput";
import { SolidButton } from "@/components/SolidButton";
import { ToDoListCard } from "@/components/ToDoListCard";
import { useApi } from "@/hooks/useApi";

interface ToDo {
  _id: string;
  title: string;
  completed: boolean;
}

export default function ToDoScreen() {
  const { fetchTodos, createTodo, deleteTodo, updateTodo } = useApi();

  const [token, setToken] = useState<string | null>(null);
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [toDoTitle, setToDoTitle] = useState<string>("");
  const [toDoToUpdate, setToDoToUpdate] = useState<string | null>(null);

  // Retrieve token and fetch todos on initial load
  useLayoutEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          router.replace("/", { relativeToDirectory: true });
          return;
        }
        setToken(storedToken);
        await fetchAndSetTodos(storedToken);
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };
    initialize();
  }, []);

  const fetchAndSetTodos = useCallback(
    async (authToken: string) => {
      try {
        const response = await fetchTodos(authToken);
        setToDos(response?.tasks || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    },
    [fetchTodos]
  );

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/", { relativeToDirectory: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCreateToDo = async () => {
    if (!toDoTitle.trim()) {
      return alert("ToDo title cannot be empty");
    }
    try {
      await createTodo({ title: toDoTitle }, token!);
      setToDoTitle("");
      await fetchAndSetTodos(token!);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDeleteToDo = async (idToDelete: string) => {
    try {
      setToDos((prevToDos) =>
        prevToDos.filter((todo) => todo._id !== idToDelete)
      );
      await deleteTodo(idToDelete, token!);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdateToDo = async () => {
    if (!toDoTitle.trim()) {
      return alert("ToDo title cannot be empty");
    }
    try {
      setToDos((prevToDos) =>
        prevToDos.map((todo) =>
          todo._id === toDoToUpdate ? { ...todo, title: toDoTitle } : todo
        )
      );
      await updateTodo(toDoToUpdate!, { title: toDoTitle }, token!);
      setToDoToUpdate(null);
      setToDoTitle("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  if (!token) {
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

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="title">Create ToDo!</ThemedText>
        <HelloWave />
      </ThemedView>

      <PrimaryTextInput
        placeholder="Enter ToDo details..."
        onChangeText={setToDoTitle}
        value={toDoTitle}
      />

      <SolidButton
        onPress={toDoToUpdate ? handleUpdateToDo : handleCreateToDo}
        label={toDoToUpdate ? "Update ToDo" : "Submit ToDo"}
      />

      <ThemedView style={styles.sectionContainer}>
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
              onDeletePress={() => handleDeleteToDo(item._id)}
              onUpdatePress={() => {
                setToDoTitle(item.title);
                setToDoToUpdate(item._id);
              }}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedText type="defaultSemiBold">No ToDo Available</ThemedText>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
