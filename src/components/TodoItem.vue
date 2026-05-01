<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { Todo } from "../Services/todosApi";

interface Props {
  todo: Todo;
}

interface Emits {
  (e: "edit", todo: Todo): void;
  (e: "delete", todo: Todo): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <article class="todo-item">
    <div class="todo-content">
      <input
        type="checkbox"
        :checked="props.todo.status === 'DONE'"
        readonly
        :aria-label="`Mark ${props.todo.name} as ${props.todo.status === 'DONE' ? 'incomplete' : 'complete'}`"
      />
      <div class="todo-text">
        <h3 :class="{ completed: props.todo.status === 'DONE' }">
          {{ props.todo.name }}
        </h3>
        <p v-if="props.todo.description" class="todo-description">
          {{ props.todo.description }}
        </p>
      </div>
    </div>

    <div class="todo-actions">
      <RouterLink
        :to="`/todo/${props.todo.id}`"
        class="btn-view"
        :aria-label="`View details of ${props.todo.name}`"
      >
        View
      </RouterLink>
      <button
        @click="emit('edit', props.todo)"
        class="btn-edit"
        :aria-label="`Edit ${props.todo.name}`"
      >
        Edit
      </button>
      <button
        @click="emit('delete', props.todo)"
        class="btn-delete-small"
        :aria-label="`Delete ${props.todo.name}`"
      >
        Delete
      </button>
    </div>
  </article>
</template>

<style scoped src="../styles/TodoItem.css"></style>
