import { useState } from "react";
import axios from "axios";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: any,
    token?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        method,
        url: `${process.env.BASE_URL}${url}`,
        data,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ``,
        },
      });
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || "Something went wrong");
      // console.error("API Error:", err);
      throw err;
    }
  };

  const register = async (userData: { username: string; password: string }) => {
    return await handleApiCall("POST", "/auth/register", userData);
  };

  const login = async (userData: { username: string; password: string }) => {
    return await handleApiCall("POST", "/auth/login", userData);
  };

  const fetchTodos = async (token: string) => {
    return await handleApiCall("GET", "/tasks", undefined, token);
  };

  const createTodo = async (todoData: { title: string }, token: string) => {
    return await handleApiCall("POST", "/tasks", todoData, token);
  };

  const updateTodo = async (
    id: string,
    todoData: { title: string },
    token: string
  ) => {
    return await handleApiCall("PUT", `/tasks/${id}`, todoData, token);
  };

  const deleteTodo = async (id: string, token: string) => {
    return await handleApiCall("DELETE", `/tasks/${id}`, undefined, token);
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
