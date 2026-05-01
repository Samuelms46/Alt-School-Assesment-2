<script setup lang="ts">
type PageItem = number | "ellipsis-start" | "ellipsis-end";

interface Props {
  currentPage: number;
  totalPages: number;
}

interface Emits {
  (e: "page-change", page: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const getPageNumbers = (): PageItem[] => {
  const pages: PageItem[] = [];
  const showEllipsisThreshold = 7;

  if (props.totalPages <= showEllipsisThreshold) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    const startPage = Math.max(2, props.currentPage - 1);
    const endPage = Math.min(props.totalPages - 1, props.currentPage + 1);

    if (startPage > 2) pages.push("ellipsis-start");

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < props.totalPages - 1) pages.push("ellipsis-end");

    pages.push(props.totalPages);
  }

  return pages;
};
</script>

<template>
  <nav class="pagination" aria-label="Pagination navigation">
    <!-- Previous -->
    <button
      @click="emit('page-change', props.currentPage - 1)"
      :disabled="props.currentPage === 1"
      aria-label="Previous page"
      class="pagination-nav-btn"
    >
      ← Previous
    </button>

    <!-- Page Numbers -->
    <div class="page-numbers">
      <template v-for="page in getPageNumbers()" :key="page">
        <!-- Ellipsis -->
        <span
          v-if="typeof page === 'string'"
          class="ellipsis"
          aria-hidden="true"
        >
          ...
        </span>

        <!-- Page Button -->
        <button
          v-else
          @click="emit('page-change', page)"
          :class="['page-btn', { active: props.currentPage === page }]"
          :aria-label="`Page ${page}`"
          :aria-current="props.currentPage === page ? 'page' : undefined"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <!-- Next -->
    <button
      @click="emit('page-change', props.currentPage + 1)"
      :disabled="props.currentPage === props.totalPages"
      aria-label="Next page"
      class="pagination-nav-btn"
    >
      Next →
    </button>
  </nav>
</template>

<style scoped src="../styles/Pagination.css"></style>
