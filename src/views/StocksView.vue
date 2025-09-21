<template>
  <div class="page-container">
    <div class="page-header">
      <h1>🏭 Склады</h1>
      <p>Данные об остатках на складах</p>
    </div>

    <FiltersPanel
        :endpoint="endpoint"
        :initial-filters="filters"
        @filters-change="handleFiltersChange"
    />

    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-label">Всего товаров:</span>
        <span class="stat-value">{{ totalItemsCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Общее количество:</span>
        <span class="stat-value">{{ totalQuantity }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">В пути к клиенту:</span>
        <span class="stat-value">{{ totalInWay }}</span>
      </div>
    </div>

    <ChartDisplay
        :data="apiData"
        :endpoint="endpoint"
        v-if="apiData.length > 0"
    />

    <DataTable
        :data="apiData"
        :loading="loading"
        :error="error"
        :endpoint="endpoint"
        @retry="fetchData"
    />

    <PaginationControls
        :current-page="currentPage"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
        @items-per-page-change="handleItemsPerPageChange"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch} from 'vue'
import { useApiStore } from '../stores/apiStore'
import FiltersPanel from '../components/FiltersPanel.vue'
import ChartDisplay from '../components/ChartDisplay.vue'
import DataTable from '../components/DataTable.vue'
import PaginationControls from '../components/PaginationControls.vue'


const endpoint = 'stocks'
const store = useApiStore()
const filters = ref({
  dateFrom: new Date().toISOString().split('T')[0], // Только текущий день
  limit: 50
})

const apiData = computed(() => store.data)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const currentPage = computed(() => store.currentPage)
const totalItems = computed(() => store.totalItems)
const itemsPerPage = computed(() => store.itemsPerPage)

// Статистика складов
const totalItemsCount = computed(() => apiData.value.length)
const totalQuantity = computed(() =>
    apiData.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
)
const totalInWay = computed(() =>
    apiData.value.reduce((sum, item) => sum + (item.in_way_to_client || 0), 0)
)

const handleFiltersChange = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters }
  store.setPage(1)
  fetchData()
}

watch(apiData, (newData) => {
  if (newData.length > 0) {
    console.log('data structure:', newData[0])
    console.log('available keys:', Object.keys(newData[0]))
  }
})

const handlePageChange = (page) => {
  store.setPage(page)
  fetchData()
}

const handleItemsPerPageChange = (limit) => {
  store.setItemsPerPage(limit)
  store.setPage(1)
  fetchData()
}

const fetchData = () => {
  store.fetchEndpointData(endpoint, filters.value)
}

onMounted(fetchData)
</script>

<style scoped>

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.stats-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.stat-item {
  flex: 1 1 200px;
  max-width: 250px;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;
}

.stats-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.stat-item {
  flex: 1 1 200px;
  max-width: 250px;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;
}


@media (max-width: 768px) {
  .stats-row {
    gap: 1rem;
  }

  .stat-item {
    flex: 1 1 180px;
    padding: 1rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .filters-panel {
    flex-direction: column;
    gap: 1rem;
  }

  .filters-panel .filter-group {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-row {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .stat-item {
    max-width: 100%;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .stat-value {
    font-size: 1.4rem;
  }
}
</style>
