<script setup>
import {Bar} from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import {ref, computed, watch} from "vue";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  data: Array,
  endpoint: String
});

const selectedField = ref('quantity');

const chartConfig = {
  sales: [
    {value: 'total_price', label: 'Сумма заказов'},
    {value: 'discount_percent', label: 'Процент скидки'},
  ],
  orders: [
    {value: 'total_price', label: 'Сумма заказов'},
    {value: 'discount_percent', label: 'Процент скидки'},
  ],
  stocks: [
    {value: 'quantity', label: 'Количество на складе'},
    {value: 'in_way_client', label: 'В пути к клиенту'},
  ],
  incomes: [
    {value: 'quantity', label: 'Количество поступлений'},
  ]
};

const availableFields = computed(() => chartConfig[props.endpoint] || []);
const chartTitle = computed(() => availableFields.value.find(f => f.value === selectedField.value)?.label || '');

const chartData = computed(() => {
  if (!props.data || props.data.length === 0) return null;

  const aggregatedData = props.data.reduce((acc, item) => {
    const date = item.date ? new Date(item.date).toLocaleDateString('ru-RU') : 'Без даты';
    const value = Number(item[selectedField.value]) || 0;

    if (!acc[date]) acc[date] = 0;
    acc[date] += value;
    return acc;
  }, {});

  const labels = Object.keys(aggregatedData);
  const values = Object.values(aggregatedData);

  return {
    labels,
    datasets: [
      {
        label: chartTitle.value,
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {display: true},
    tooltip: {
      callbacks: {
        label: context => `${context.dataset.label}: ${context.raw.toLocaleString('ru-RU')}`
      }
    }
  },
  scales: {
    y: {beginAtZero: true},
    x: {
      ticks: {autoSkip: false},
      grid: {drawTicks: false}
    }
  }
};

watch(() => props.endpoint, (newEndpoint) => {
  if (chartConfig[newEndpoint]?.length > 0) selectedField.value = chartConfig[newEndpoint][0].value;
}, {immediate: true});
</script>

<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>{{ chartTitle }}</h3>
      <select v-model="selectedField" class="field-select">
        <option v-for="field in availableFields" :key="field.value" :value="field.value">
          {{ field.label }}
        </option>
      </select>
    </div>

    <div class="chart-wrapper">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions"/>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chart-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.chart-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chart-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.field-select {
  padding: 0.5rem;
  border: 1px solid #dcdfe3;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #f9fbfd;
  width: 100%;
}

.chart-wrapper {
  width: 100%;
  height: 280px;
  position: relative;
}


@media (max-width: 768px) {
  .chart-container {
    padding: 0.8rem;
  }

  .chart-header h3 {
    font-size: 0.95rem;
  }

  .chart-wrapper {
    height: 240px;
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    height: 200px;
  }

  .field-select {
    font-size: 0.85rem;
  }
}
</style>
