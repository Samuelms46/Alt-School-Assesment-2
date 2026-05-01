import { defineStore } from "pinia";
import { ref } from "vue";
import { todosApi } from "../Services/todosApi";
import type { Todo, TodoData } from "../Services/todosApi";

export const useTodoStore = defineStore("todo", () => {
  // State
  const todos = ref<Todo[]>([]);
  const currentTodo = ref<Todo | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Helpers
  const setError = (err: unknown) => {
    error.value = err instanceof Error ? err.message : "Something went wrong";
  };

  // READ - fetch all
  const fetchAllTodos = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await todosApi.getAllTodos();
      todos.value = response.data;
    } catch (err) {
      setError(err);
    } finally {
      isLoading.value = false;
    }
  };

  // READ - fetch single
  const fetchTodoById = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      currentTodo.value = await todosApi.getById(id);
    } catch (err) {
      setError(err);
    } finally {
      isLoading.value = false;
    }
  };

  // CREATE
  const createTodo = async (todoData: Partial<TodoData>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const newTodo = await todosApi.create(todoData);
      todos.value.unshift(newTodo);
    } catch (err) {
      setError(err);
      throw err; // re-throw so component can handle if needed
    } finally {
      isLoading.value = false;
    }
  };

  // UPDATE
  const updateTodo = async (id: string, todoData: Partial<TodoData>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await todosApi.update(id, todoData);
      const index = todos.value.findIndex((t) => t.id === id);
      if (index !== -1) todos.value[index] = updated;
      if (currentTodo.value?.id === id) currentTodo.value = updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // DELETE
  const deleteTodo = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await todosApi.delete(id);
      todos.value = todos.value.filter((t) => t.id !== id);
      if (currentTodo.value?.id === id) currentTodo.value = null;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    todos,
    currentTodo,
    isLoading,
    error,
    // Actions
    fetchAllTodos,
    fetchTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
  };
});
