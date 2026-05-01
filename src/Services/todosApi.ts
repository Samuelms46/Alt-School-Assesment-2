const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.oluwasetemi.dev";

// Types
export interface TodoData {
  title?: string;
  name?: string;
  description?: string;
  completed?: boolean;
  status?: "TODO" | "DONE" | "IN_PROGRESS";
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

export interface Todo {
  id: string;
  name: string;
  description: string | null;
  status: "TODO" | "DONE" | "IN_PROGRESS";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
}

// Error Handler
const handleApiError = async (
  response: Response,
  defaultMessage: string,
): Promise<never> => {
  let errorMessage = defaultMessage;
  try {
    const errorData = await response.json();
    if (errorData.errors) {
      errorMessage = JSON.stringify(errorData.errors, null, 2);
    } else {
      errorMessage =
        errorData.message || errorData.error || JSON.stringify(errorData);
    }
    console.error("API Error Details:", errorData);
  } catch (e) {
    console.error("Could not parse error response:", e);
  }
  throw new Error(`${errorMessage} (Status: ${response.status})`);
};

export const todosApi = {
  // READ
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/tasks?page=${page}&limit=${limit}`,
      );
      if (!response.ok) {
        await handleApiError(response, "Failed to fetch todos");
      }
      return response.json();
    } catch (error) {
      console.error("API Error (getAll):", error);
      throw error;
    }
  },

  getAllTodos: async (): Promise<PaginatedResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/tasks?limit=10000`);
      if (!response.ok) {
        await handleApiError(response, "Failed to fetch all todos");
      }
      return response.json();
    } catch (error) {
      console.error("API Error (getAllTodos):", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Todo> => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${id}`);
      if (!response.ok) {
        await handleApiError(response, "Failed to fetch todo");
      }
      return response.json();
    } catch (error) {
      console.error("API Error (getById):", error);
      throw error;
    }
  },

  // CREATE
  create: async (todoData: TodoData): Promise<Todo> => {
    try {
      const payload = {
        name: todoData.title || todoData.name,
        description: todoData.description || null,
        status: todoData.completed ? "DONE" : "TODO",
        priority: todoData.priority || "LOW",
      };

      console.log("Creating todo with payload:", payload);

      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Create response status:", response.status);

      if (!response.ok) {
        await handleApiError(response, "Failed to create todo");
      }
      return response.json();
    } catch (error) {
      console.error("API Error (create):", error);
      throw error;
    }
  },

  // UPDATE
  update: async (id: string, todoData: TodoData): Promise<Todo> => {
    try {
      const payload = {
        name: todoData.title || todoData.name,
        description: todoData.description || null,
        status: todoData.completed ? "DONE" : todoData.status || "TODO",
        priority: todoData.priority || "LOW",
      };

      console.log("Updating todo:", id, "with payload:", payload);

      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Update (PATCH) response status:", response.status);

      if (!response.ok) {
        await handleApiError(response, "Failed to update todo");
      }

      return response.json();
    } catch (error) {
      console.error("API Error (update):", error);
      throw error;
    }
  },

  // DELETE
  delete: async (id: string): Promise<{ success: true } | Todo> => {
    try {
      console.log("Deleting todo:", id);
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        await handleApiError(response, "Failed to delete todo");
      }

      if (response.status === 204) {
        return { success: true };
      }

      return response.json();
    } catch (error) {
      console.error("API Error (delete):", error);
      throw error;
    }
  },
};
