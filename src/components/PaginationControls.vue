<template>
  <div class="pagination-controls" v-if="totalItems > 0">
    <div class="pagination-info">
      <span>Показано: {{ showingStart }}-{{ showingEnd }} из {{ totalItems }}</span>
    </div>

    <div class="pagination-buttons">
      <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
      >
        ← Назад
      </button>

      <div class="page-numbers">
        <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="{ active: page === currentPage, 'page-btn': true }"
        >
          {{ page }}
        </button>

        <span v-if="hasMorePages" class="page-dots">...</span>
      </div>

      <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
      >
        Вперед →
      </button>
    </div>

    <div class="items-per-page">
      <label>На странице:</label>
      <select v-model="localItemsPerPage" @change="handleItemsPerPageChange">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0
  },
  itemsPerPage: {
    type: Number,
    required: true,
    default: 50
  }
})

const emit = defineEmits(['page-change', 'items-per-page-change'])

const localItemsPerPage = ref(props.itemsPerPage)

// Вычисляемые свойства
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const showingStart = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const showingEnd = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return end > props.totalItems ? props.totalItems : end
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const hasMorePages = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < totalPages.value
})

// Методы
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}

const handleItemsPerPageChange = () => {
  emit('items-per-page-change', Number(localItemsPerPage.value))
  // При изменении количества элементов возвращаемся на первую страницу
  emit('page-change', 1)
}

// Следим за изменением props
watch(() => props.itemsPerPage, (newValue) => {
  localItemsPerPage.value = newValue
})
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.9rem;
  color: #666;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  min-width: 2.5rem;
  transition: all 0.3s;
}

.page-btn:hover {
  background: #f8f9fa;
}

.page-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.page-dots {
  padding: 0.5rem;
  color: #666;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-per-page label {
  font-size: 0.9rem;
  color: #666;
}

.items-per-page select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}


@media (max-width: 768px) {
  .pagination-controls {
    flex-direction: column;
    text-align: center;
  }

  .pagination-buttons {
    order: -1;
  }
}
</style>