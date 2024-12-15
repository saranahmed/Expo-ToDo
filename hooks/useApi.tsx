import { useState } from "react";
import axios from "axios";

const BASE_URL = " http://localhost:3000";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: any
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${url}`,
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || "Something went wrong");
      console.error("API Error:", err);
      throw err;
    }
  };

  const register = async (userData: { username: string; password: string }) => {
    return await handleApiCall("POST", "/auth/register", userData);
  };

  const login = async (userData: { username: string; password: string }) => {
    return await handleApiCall("POST", "/auth/login", userData);
  };

  const fetchTodos = async () => {
    return await handleApiCall("GET", "/todos");
  };

  const createTodo = async (todoData: {
    title: string;
    description: string;
  }) => {
    return await handleApiCall("POST", "/todos", todoData);
  };

  const updateTodo = async (
    id: string,
    todoData: { title?: string; description?: string }
  ) => {
    return await handleApiCall("PUT", `/todos/${id}`, todoData);
  };

  const deleteTodo = async (id: string) => {
    return await handleApiCall("DELETE", `/todos/${id}`);
  };

  return {
    register,
    login,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    loading,
    error,
  };
}
