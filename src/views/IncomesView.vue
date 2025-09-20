<template>
  <div class="page-container">
    <div class="page-header">
      <h1>💰 Доходы</h1>
      <p>Анализ доходов и поступлений</p>
    </div>

    <FiltersPanel
        :endpoint="endpoint"
        :initial-filters="filters"
        @filters-change="handleFiltersChange"
    />

    <div class="income-stats">
      <div class="stat-card">
        <h3>Всего поступлений</h3>
        <p class="stat-number">{{ totalIncomes }}</p>
      </div>
      <div class="stat-card">
        <h3>Общее количество</h3>
        <p class="stat-number">{{ totalQuantity }}</p>
      </div>
      <div class="stat-card">
        <h3>Среднее на поступление</h3>
        <p class="stat-number">{{ averagePerIncome }}</p>
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

    <div class="status-filter" v-if="apiData.length > 0">
      <h4>Фильтр по статусу:</h4>
      <select v-model="statusFilter" @change="filterByStatus">
        <option value="">Все статусы</option>
        <option v-for="status in uniqueStatuses" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch} from 'vue'
import { useApiStore } from '../stores/apiStore'
import FiltersPanel from '../components/FiltersPanel.vue'
import ChartDisplay from '../components/ChartDisplay.vue'
import DataTable from '../components/DataTable.vue'
import PaginationControls from '../components/PaginationControls.vue'

const endpoint = 'incomes'
const store = useApiStore()
const filters = ref({
  dateFrom: '',
  dateTo: '',
  limit: 50
})

const statusFilter = ref('')
const filteredData = ref([])



const apiData = computed(() => store.data)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const currentPage = computed(() => store.currentPage)
const totalItems = computed(() => store.totalItems)
const itemsPerPage = computed(() => store.itemsPerPage)

// Уникальные статусы для фильтра
const uniqueStatuses = computed(() => {
  const statuses = new Set()
  apiData.value.forEach(item => {
    if (item.status) statuses.add(item.status)
  })
  return Array.from(statuses).sort()
})

// Статистика доходов
const totalIncomes = computed(() => apiData.value.length)
const totalQuantity = computed(() =>
    apiData.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
)
const averagePerIncome = computed(() => {
  if (apiData.value.length === 0) return 0
  return Math.round(totalQuantity.value / apiData.value.length)
})

watch(apiData, (newData) => {
  if (newData.length > 0) {
    console.log('📊 Sales data structure:', newData[0])
    console.log('🔑 Sales available keys:', Object.keys(newData[0]))
  }
})

const handleFiltersChange = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters }
  statusFilter.value = '' // Сброс фильтра статуса
  store.setPage(1)
  fetchData()
}

const handlePageChange = (page) => {
  store.setPage(page)
  fetchData()
}

const handleItemsPerPageChange = (limit) => {
  store.setItemsPerPage(limit)
  store.setPage(1)
  fetchData()
}

const filterByStatus = () => {
  if (!statusFilter.value) {
    filteredData.value = apiData.value
  } else {
    filteredData.value = apiData.value.filter(item =>
        item.status === statusFilter.value
    )
  }
}

const fetchData = () => {
  store.fetchEndpointData(endpoint, filters.value)
}

onMounted(() => {
  const today = new Date()
  const monthAgo = new Date()
  monthAgo.setMonth(today.getMonth() - 1)

  filters.value.dateFrom = monthAgo.toISOString().split('T')[0]
  filters.value.dateTo = today.toISOString().split('T')[0]

  fetchData()
})
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.income-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.income-stats .stat-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
}

.income-stats .stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.status-filter {
  margin-top: 2.5rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.status-filter h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.status-filter select {
  padding: 0.6rem 1rem;
  border: 1px solid #dcdfe3;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #2c3e50;
  background: #f9fbfd;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.status-filter select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}
</style>
