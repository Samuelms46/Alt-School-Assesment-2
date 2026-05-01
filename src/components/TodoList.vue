<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTodoStore } from "../stores/todoStore";
import type { Todo } from "../Services/todosApi";
import TodoItem from "./TodoItem.vue";
import Pagination from "./Pagination.vue";
import SearchFilter from "./SearchFilter.vue";
import TodoModal from "./TodoModel.vue";
import DeleteConfirmModal from "./DeleteConfirmationModel.vue";

const store = useTodoStore();

// State
const currentPage = ref(1);
const searchTerm = ref("");
const statusFilter = ref<"all" | "complete" | "incomplete">("all");
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editingTodo = ref<Todo | null>(null);
const deletingTodo = ref<Todo | null>(null);
const itemsPerPage = 10;

// Filtered + paginated todos
const filteredTodos = computed(() => {
  let todos = store.todos;

  if (searchTerm.value) {
    todos = todos.filter((todo) =>
      todo.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
    );
  }

  if (statusFilter.value === "complete") {
    todos = todos.filter((todo) => todo.status === "DONE");
  } else if (statusFilter.value === "incomplete") {
    todos = todos.filter((todo) => todo.status !== "DONE");
  }

  return todos;
});

const totalPages = computed(() =>
  Math.ceil(filteredTodos.value.length / itemsPerPage),
);

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTodos.value.slice(start, start + itemsPerPage);
});

// Handlers
const handleSearchChange = (value: string) => {
  searchTerm.value = value;
  currentPage.value = 1;
};

const handleStatusChange = (value: "all" | "complete" | "incomplete") => {
  statusFilter.value = value;
  currentPage.value = 1;
};

const handleOpenCreateModal = () => {
  editingTodo.value = null;
  isModalOpen.value = true;
};

const handleEditTodo = (todo: Todo) => {
  editingTodo.value = todo;
  isModalOpen.value = true;
};

const handleDeleteClick = (todo: Todo) => {
  deletingTodo.value = todo;
  isDeleteModalOpen.value = true;
};

const handleCloseModal = () => {
  isModalOpen.value = false;
  editingTodo.value = null;
};

const handleCloseDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deletingTodo.value = null;
};

const handleSubmit = async (formData: Partial<Todo>) => {
  const sanitizedData = {
    ...formData,
    description: formData.description || undefined,
  };

  if (editingTodo.value) {
    await store.updateTodo(editingTodo.value.id, sanitizedData);
  } else {
    await store.createTodo(sanitizedData);
  }
  handleCloseModal();
};

const handleConfirmDelete = async () => {
  if (deletingTodo.value) {
    await store.deleteTodo(deletingTodo.value.id);
    handleCloseDeleteModal();
  }
};

const clearFilters = () => {
  searchTerm.value = "";
  statusFilter.value = "all";
  currentPage.value = 1;
};

onMounted(() => store.fetchAllTodos());
</script>

<template>
  <div class="todo-list-container">
    <!-- Loading -->
    <div v-if="store.isLoading" class="loading-container">
      <div class="spinner" aria-label="Loading todos"></div>
      <p>Loading todos...</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="error-container" role="alert">
      <h2>Error loading todos</h2>
      <p>{{ store.error }}</p>
      <button @click="store.fetchAllTodos()">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
      <header class="todo-header">
        <h1>My Todos</h1>
        <p>Manage your tasks efficiently</p>
        <button @click="handleOpenCreateModal" class="create-todo-btn">
          + Create New Todo
        </button>
      </header>

      <SearchFilter
        :search-term="searchTerm"
        :status-filter="statusFilter"
        @search-change="handleSearchChange"
        @status-change="handleStatusChange"
      />

      <!-- Empty State -->
      <div v-if="paginatedTodos.length === 0" class="empty-state">
        <p>No todos found matching your criteria.</p>
        <button
          v-if="searchTerm || statusFilter !== 'all'"
          @click="clearFilters"
          class="clear-filters-btn"
        >
          Clear Filters
        </button>
      </div>

      <!-- Todo Grid -->
      <template v-else>
        <section class="todos-grid">
          <TodoItem
            v-for="todo in paginatedTodos"
            :key="todo.id"
            :todo="todo"
            @edit="handleEditTodo"
            @delete="handleDeleteClick"
          />
        </section>

        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="currentPage = $event"
        />
      </template>
    </template>

    <!-- Modals -->
    <TodoModal
      :is-open="isModalOpen"
      :todo="editingTodo"
      :mode="editingTodo ? 'edit' : 'create'"
      @close="handleCloseModal"
      @submit="handleSubmit"
    />

    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      :todo-title="deletingTodo?.name ?? ''"
      @close="handleCloseDeleteModal"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<style scoped src="../styles/TodoList.css"></style>
