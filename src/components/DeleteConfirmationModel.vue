<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
    <div class="confirm-modal-content" @click.stop>
      <div class="confirm-icon">⚠️</div>
      <h2>Delete Todo?</h2>
      <p>
        Are you sure you want to delete <strong>"{{ todoTitle }}"</strong>?
        <br />
        This action cannot be undone.
      </p>
      <div class="confirm-actions">
        <button @click="onClose" class="btn-cancel">Cancel</button>
        <button @click="onConfirm" class="btn-delete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "../styles/DeleteConfirmModel.css";

interface Props {
  isOpen: boolean;
  todoTitle: string;
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
  todoTitle: "",
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const handleOverlayClick = () => {
  emit("close");
};

const onClose = () => {
  emit("close");
};

const onConfirm = () => {
  emit("confirm");
};
</script>

<style scoped src="../styles/DeleteConfirmModel.css"></style>
