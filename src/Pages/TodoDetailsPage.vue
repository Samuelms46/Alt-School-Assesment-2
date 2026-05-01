<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { todosApi } from "../Services/todosApi";
import type { Todo } from "../Services/todosApi";
import "../styles/TodoDetail.css";

const route = useRoute();
const router = useRouter();

const todo = ref<Todo | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const isComplete = computed(() => todo.value?.status === "DONE");

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const fetchTodo = async () => {
  const idParam = route.params.id;
  const id = typeof idParam === "string" ? idParam : "";

  if (!id) {
    error.value = "Invalid todo id";
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    todo.value = await todosApi.getById(id);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load todo";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTodo);
</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <div class="spinner" aria-label="Loading todo details"></div>
    <p>Loading todo details...</p>
  </div>

  <div v-else-if="error" class="error-container" role="alert">
    <h2>Error loading todo</h2>
    <p>{{ error }}</p>
    <RouterLink to="/" class="back-link">&larr; Back to Todos</RouterLink>
  </div>

  <main v-else-if="todo" class="todo-detail-page">
    <div class="todo-detail-container">
      <button @click="router.back()" class="back-button">&larr; Back</button>

      <article class="todo-detail-card">
        <header class="todo-detail-header">
          <h1>{{ todo.name }}</h1>
          <span
            class="status-badge"
            :class="isComplete ? 'complete' : 'incomplete'"
          >
            {{ isComplete ? "✓ Complete" : "○ Incomplete" }}
          </span>
        </header>

        <div class="todo-detail-content">
          <section v-if="todo.description" class="detail-section">
            <h2>Description</h2>
            <p>{{ todo.description }}</p>
          </section>

          <section class="detail-section">
            <h2>Details</h2>
            <dl class="detail-list">
              <div class="detail-item">
                <dt>ID:</dt>
                <dd>{{ todo.id }}</dd>
              </div>
              <div class="detail-item">
                <dt>Status:</dt>
                <dd>{{ isComplete ? "Completed" : "Pending" }}</dd>
              </div>
              <div v-if="todo.createdAt" class="detail-item">
                <dt>Created:</dt>
                <dd>{{ formatDate(todo.createdAt) }}</dd>
              </div>
              <div v-if="todo.updatedAt" class="detail-item">
                <dt>Updated:</dt>
                <dd>{{ formatDate(todo.updatedAt) }}</dd>
              </div>
            </dl>
          </section>
        </div>
      </article>
    </div>
  </main>
</template>
