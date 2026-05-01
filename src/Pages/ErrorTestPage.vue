<script setup lang="ts">
import { computed, ref } from "vue";

const shouldError = ref(false);

const triggerError = () => {
  shouldError.value = true;
};

const errorGuard = computed(() => {
  if (shouldError.value) {
    throw new Error("This is a test error to demonstrate the Error Boundary!");
  }

  return null;
});
</script>

<template>
  <div style="padding: 2rem; text-align: center">
    <h1>Error Boundary Test</h1>
    <p>
      Click the button below to trigger an error and see the Error Boundary in
      action.
    </p>
    <div v-if="errorGuard" />
    <button
      type="button"
      @click="triggerError"
      style="
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-size: 1rem;
        margin-top: 1rem;
        cursor: pointer;
      "
    >
      Trigger Error
    </button>
  </div>
</template>
