<script setup lang="ts">
import { onErrorCaptured, ref } from "vue";
import { useRouter } from "vue-router";

const hasError = ref(false);
const error = ref<Error | null>(null);
const router = useRouter();

onErrorCaptured((err) => {
  hasError.value = true;
  error.value = err instanceof Error ? err : new Error(String(err));
  console.error("Error caught by boundary:", err);
  return false;
});
</script>

<template>
  <div v-if="hasError">
    <h1>Something went wrong</h1>
    <p>{{ error?.message }}</p>
    <button type="button" @click="window.location.href = '/'">
      Go to Home
    </button>
  </div>
</template>
