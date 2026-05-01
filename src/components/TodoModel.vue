<script setup lang="ts">
import { ref, watch } from "vue";
import type { Todo } from "../Services/todosApi";

interface FormData {
  name: string;
  description: string;
  status: "TODO" | "DONE";
}

interface Errors {
  name?: string;
}

interface Props {
  isOpen: boolean;
  todo?: Todo | null;
  mode?: "create" | "edit";
}

interface Emits {
  (e: "close"): void;
  (e: "submit", formData: FormData): void;
}

const props = withDefaults(defineProps<Props>(), {
  todo: null,
  mode: "create",
});

const emit = defineEmits<Emits>();

// State
const formData = ref<FormData>({
  name: "",
  description: "",
  status: "TODO",
});

const errors = ref<Errors>({});

// Populate form when editing
watch([() => props.todo, () => props.mode, () => props.isOpen], () => {
  if (props.todo && props.mode === "edit") {
    formData.value = {
      name: props.todo.name ?? "",
      description: props.todo.description ?? "",
      status: props.todo.status === "DONE" ? "DONE" : "TODO",
    };
  } else {
    formData.value = { name: "", description: "", status: "TODO" };
  }
  errors.value = {};
});

// Validation
const validate = (): boolean => {
  const newErrors: Errors = {};
  if (!formData.value.name.trim()) {
    newErrors.name = "Title is required";
  }
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// Handlers
const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", formData.value);
  errors.value = {};
};

const handleNameInput = (e: Event) => {
  formData.value.name = (e.target as HTMLInputElement).value;
  if (errors.value.name) errors.value.name = "";
};
</script>

<template>
  <Teleport to="body">
    <div v-if="props.isOpen" class="modal-overlay" @click="emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>
            {{ props.mode === "create" ? "Create New Todo" : "Edit Todo" }}
          </h2>
          <button
            @click="emit('close')"
            class="close-button"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div class="todo-form">
          <!-- Title -->
          <div class="form-group">
            <label for="name"> Title <span class="required">*</span> </label>
            <input
              id="name"
              name="name"
              type="text"
              :value="formData.name"
              @input="handleNameInput"
              :class="{ error: errors.name }"
              placeholder="Enter todo title"
              autofocus
            />
            <span v-if="errors.name" class="error-message">
              {{ errors.name }}
            </span>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              v-model="formData.description"
              placeholder="Enter todo description (optional)"
              rows="4"
            />
          </div>

          <!-- Status Checkbox -->
          <div class="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                :checked="formData.status === 'DONE'"
                @change="
                  formData.status = formData.status === 'DONE' ? 'TODO' : 'DONE'
                "
              />
              <span>Mark as completed</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <button type="button" @click="emit('close')" class="btn-cancel">
              Cancel
            </button>
            <button type="button" @click="handleSubmit" class="btn-submit">
              {{ props.mode === "create" ? "Create Todo" : "Update Todo" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped src="../styles/TodoModel.css"></style>
