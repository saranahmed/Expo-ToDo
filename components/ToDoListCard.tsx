import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

interface ToDoListCardProps {
  data: {
    title: string;
    _id?: string;
  };
  index: number;
  onDeletePress: () => void;
  onUpdatePress: () => void;
}

export function ToDoListCard({
  data,
  index,
  onDeletePress,
  onUpdatePress,
}: ToDoListCardProps) {
  return (
    <View style={styles.cardContainer}>
      <ThemedText type="default" style={styles.taskNumber}>
        {index + 1}
      </ThemedText>

      <ThemedText type="default" style={styles.taskTitle}>
        {data?.title}
      </ThemedText>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onUpdatePress}>
          <ThemedText type="default" style={styles.updateText}>
            Update
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDeletePress}>
          <ThemedText type="default" style={styles.deleteText}>
            Delete
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.dark.icon,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  taskNumber: {
    color: "#777",
    marginRight: 16,
  },
  taskTitle: {
    color: "#777",
    flex: 1,
    textAlign: "center",
    marginRight: 16,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 16,
  },
  updateText: {
    color: "#006400",
  },
  deleteText: {
    color: "#800000",
  },
});
