<template>
  <div class="page-container">
    <div class="page-header">
      <h1>📈 Продажи</h1>
      <p>Анализ данных о продажах за период</p>
    </div>

    <FiltersPanel
        :endpoint="endpoint"
        :initial-filters="filters"
        @filters-change="handleFiltersChange"
    />

    <!-- Добавим статистику продаж -->
    <div class="stats-cards" v-if="apiData.length > 0">
      <div class="stat-card">
        <h3>Всего продаж</h3>
        <p class="stat-number">{{ totalSales }}</p>
      </div>
      <div class="stat-card">
        <h3>Общая выручка</h3>
        <p class="stat-number">{{ totalRevenue }} ₽</p>
      </div>
      <div class="stat-card">
        <h3>Средний чек</h3>
        <p class="stat-number">{{ averageSaleValue }} ₽</p>
      </div>
      <div class="stat-card">
        <h3>Средняя скидка</h3>
        <p class="stat-number">{{ averageDiscount }}%</p>
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
import { ref, onMounted, computed, watch } from 'vue'
import { useApiStore } from '../stores/apiStore'
import FiltersPanel from '../components/FiltersPanel.vue'
import ChartDisplay from '../components/ChartDisplay.vue'
import DataTable from '../components/DataTable.vue'
import PaginationControls from '../components/PaginationControls.vue'

const endpoint = 'sales'
const store = useApiStore()
const filters = ref({
  dateFrom: '',
  dateTo: '',
  limit: 50
})

const apiData = computed(() => store.data || [])
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const currentPage = computed(() => store.currentPage)
const totalItems = computed(() => store.totalItems)
const itemsPerPage = computed(() => store.itemsPerPage)


// Статистика продаж на основе реальных полей
const totalSales = computed(() => apiData.value.length)
const totalRevenue = computed(() =>
    apiData.value.reduce((sum, sale) => sum + (Number(sale.for_pay) || 0), 0)
)
const averageSaleValue = computed(() => {
  if (apiData.value.length === 0) return 0
  return Math.round(totalRevenue.value / apiData.value.length)
})
const averageDiscount = computed(() => {
  if (apiData.value.length === 0) return 0
  const totalDiscount = apiData.value.reduce((sum, sale) =>
      sum + (Number(sale.discount_percent) || 0), 0
  )
  return Math.round(totalDiscount / apiData.value.length)
})

const handleFiltersChange = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters }
  store.setPage(1)
  fetchData()
}

const handlePageChange = (page) => {
  store.setPage(page)
  fetchData()
}

const handleItemsPerPageChange = (limit) => {
  store.setItemsPerPage(Number(limit))
  store.setPage(1)
  fetchData()
}

const fetchData = () => {
  console.log('🚀 Fetching sales with filters:', filters.value)
  store.fetchEndpointData(endpoint, filters.value)
}

// Отладка структуры данных
watch(apiData, (newData) => {
  if (newData.length > 0) {
    console.log('📊 Sales data structure:', newData[0])
    console.log('🔑 Sales available keys:', Object.keys(newData[0]))
  }
})

onMounted(() => {
  console.log('📍 SalesView mounted')

  // Устанавливаем даты по умолчанию: последние 7 дней
  const today = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(today.getDate() - 7)

  filters.value.dateFrom = weekAgo.toISOString().split('T')[0]
  filters.value.dateTo = today.toISOString().split('T')[0]

  console.log('📅 Default dates:', filters.value)
  fetchData()
})
</script>

<style scoped>
.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.page-header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.page-header p {
  max-width: 700px;
  margin: 0 auto;
  color: #7f8c8d;
  font-size: 1.1rem;
  line-height: 1.6;
}

.page-header::after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: #3498db;
  margin: 1.5rem auto 0;
  border-radius: 2px;
}
</style>
