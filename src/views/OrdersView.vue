<template>
  <div class="page-container">
    <div class="page-header">
      <h1>📦 Заказы</h1>
      <p>Анализ данных о заказах</p>
    </div>

    <FiltersPanel
        :endpoint="endpoint"
        :initial-filters="filters"
        @filters-change="handleFiltersChange"
    />

    <div class="stats-cards">
      <div class="stat-card">
        <h3>Всего заказов</h3>
        <p class="stat-number">{{ totalOrders }}</p>
      </div>
      <div class="stat-card">
        <h3>Отмененные</h3>
        <p class="stat-number">{{ canceledOrders }}</p>
        <p class="stat-percent">({{ cancelPercentage }}%)</p>
      </div>
      <div class="stat-card">
        <h3>Средний чек</h3>
        <p class="stat-number">{{ averageOrderValue }} ₽</p>
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
import {useApiStore} from '../stores/apiStore'
import FiltersPanel from '../components/FiltersPanel.vue'
import ChartDisplay from '../components/ChartDisplay.vue'
import DataTable from '../components/DataTable.vue'
import PaginationControls from '../components/PaginationControls.vue'

const endpoint = 'orders'
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

// Статистика
const totalOrders = computed(() => apiData.value.length)
const canceledOrders = computed(() =>
    apiData.value.filter(order => order.is_cancel === true || order.is_cancel === 'true').length
)
const cancelPercentage = computed(() => {
  if (totalOrders.value === 0) return 0
  return Math.round((canceledOrders.value / totalOrders.value) * 100)
})
const averageOrderValue = computed(() => {
  if (apiData.value.length === 0) return 0
  const validOrders = apiData.value.filter(order => order.total_price > 0)
  if (validOrders.length === 0) return 0
  const total = validOrders.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0)
  return Math.round(total / validOrders.length)
})

const handleFiltersChange = (newFilters) => {
  filters.value = {...filters.value, ...newFilters}
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
  console.log(' Fetching orders with filters:', filters.value)
  store.fetchEndpointData(endpoint, filters.value)
}

watch(apiData, (newData) => {
  if (newData.length > 0) {
    console.log('data structure:', newData[0])
    console.log('available keys:', Object.keys(newData[0]))
  }
})

onMounted(() => {
  console.log('OrdersView mounted')

  const today = new Date()
  const monthAgo = new Date()
  monthAgo.setMonth(today.getMonth() - 1)

  filters.value.dateFrom = monthAgo.toISOString().split('T')[0]
  filters.value.dateTo = today.toISOString().split('T')[0]

  console.log('Default dates:', filters.value)
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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  padding: 1.8rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}

.stat-card h3 {
  margin: 0 0 0.75rem 0;
  color: #7f8c8d;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.stat-percent {
  font-size: 0.9rem;
  margin-top: 0.4rem;
  font-weight: 500;
}


.stat-percent {
  color: #e74c3c;
}

.stat-percent {
  color: #27ae60;
}


.stat-card:nth-child(2) {
  border-top: 4px solid #e74c3c;
}

.stat-card:nth-child(3) {
  border-top: 4px solid #27ae60;
}


@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem 0.8rem;
  }

  .page-header h1 {
    font-size: 1.6rem;
  }

  .page-header p {
    font-size: 0.9rem;
  }
}


@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .stat-card h3 {
    font-size: 0.85rem;
  }

  .stat-number {
    font-size: 1.6rem;
  }

  .stat-percent {
    font-size: 0.8rem;
  }

  .page-header h1 {
    font-size: 1.4rem;
  }

  .page-header p {
    font-size: 0.85rem;
  }

  .filters-panel {
    flex-direction: column;
    gap: 1rem;
  }

  .filters-panel .filter-group,
  .status-filter select {
    width: 100%;
  }

</style>
