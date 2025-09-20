<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: inline-block;
  margin-right: 0.5rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>