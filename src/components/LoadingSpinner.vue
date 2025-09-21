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

@media (max-width: 768px) {
  .spinner {
    width: 30px;
    height: 30px;
    border-width: 3px;
  }
}

@media (max-width: 480px) {
  .spinner {
    width: 25px;
    height: 25px;
    border-width: 2.5px;
  }
}
</style>
