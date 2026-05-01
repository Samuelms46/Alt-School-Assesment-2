<script setup lang="ts">
type StatusFilter = "all" | "complete" | "incomplete";

interface Props {
  searchTerm: string;
  statusFilter: StatusFilter;
}

interface Emits {
  (e: "search-change", value: string): void;
  (e: "status-change", value: StatusFilter): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="search-filter-container">
    <!-- Search -->
    <div class="search-box">
      <label for="search-input" class="visually-hidden">Search todos</label>
      <input
        id="search-input"
        type="text"
        placeholder="Search todos by title..."
        :value="props.searchTerm"
        @input="
          emit('search-change', ($event.target as HTMLInputElement).value)
        "
        class="search-input"
        aria-label="Search todos by title"
      />
    </div>

    <!-- Filter Buttons -->
    <div
      class="filter-buttons"
      role="group"
      aria-label="Filter by completion status"
    >
      <button
        v-for="filter in ['all', 'complete', 'incomplete'] as StatusFilter[]"
        :key="filter"
        @click="emit('status-change', filter)"
        :class="['filter-btn', { active: props.statusFilter === filter }]"
        :aria-pressed="props.statusFilter === filter"
      >
        {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
      </button>
    </div>
  </div>
</template>

<style scoped src="../styles/SearchFilter.css"></style>
