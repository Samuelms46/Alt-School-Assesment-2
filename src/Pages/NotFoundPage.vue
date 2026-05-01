<script setup lang="ts">
import "../styles/NotFound.css";
</script>

<template>
  <main>
    <main class="not-found-page">
      <div class="not-found-container">
        <h1 class="error-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <RouterLink to="/" class="home-link"> ← Back to Home </RouterLink>
      </div>
    </main>
  </main>
</template>
