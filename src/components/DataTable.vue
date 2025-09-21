<script setup>
import { computed } from "vue";
import LoadingSpinner from './LoadingSpinner.vue'; // Добавьте импорт

const props = defineProps({
  data: Array,
  loading: Boolean,
  error: String,
  endpoint: String,
})

const emit = defineEmits(['retry']);

const headers = computed(() => {
  const endpointHeaders = {
    sales: [
      { key: 'date', label: 'Дата', type: 'date' },
      { key: 'last_change_date', label: 'Последнее изменение', type: 'datetime' },
      { key: 'sale_id', label: 'ID продажи', type: 'text' },
      { key: 'supplier_article', label: 'Артикул поставщика', type: 'text' },
      { key: 'barcode', label: 'Штрихкод', type: 'text' },
      { key: 'total_price', label: 'Общая цена', type: 'currency' },
      { key: 'for_pay', label: 'К оплате', type: 'currency' },
      { key: 'finished_price', label: 'Итоговая цена', type: 'currency' },
      { key: 'price_with_disc', label: 'Цена со скидкой', type: 'currency' },
      { key: 'discount_percent', label: 'Скидка %', type: 'percent' },
      { key: 'warehouse_name', label: 'Склад', type: 'text' },
      { key: 'region_name', label: 'Регион', type: 'text' },
      { key: 'country_name', label: 'Страна', type: 'text' },
    ],
    orders: [
      { key: 'date', label: 'Дата заказа', type: 'date' },
      { key: 'last_change_date', label: 'Последнее изменение', type: 'datetime' },
      { key: 'supplier_article', label: 'Артикул поставщика', type: 'text' },
      { key: 'tech_size', label: 'Размер', type: 'text' },
      { key: 'barcode', label: 'Штрихкод', type: 'text' },
      { key: 'total_price', label: 'Общая цена', type: 'currency' },
      { key: 'discount_percent', label: 'Скидка %', type: 'percent' },
      { key: 'warehouse_name', label: 'Склад', type: 'text' },
      { key: 'oblast', label: 'Область', type: 'text' },
      { key: 'nm_id', label: 'NM ID', type: 'text' },
      { key: 'subject', label: 'Предмет', type: 'text' },
      { key: 'category', label: 'Категория', type: 'text' },
      { key: 'brand', label: 'Бренд', type: 'text' },
      { key: 'is_cancel', label: 'Отменен', type: 'boolean' },
    ],
    stocks: [
      { key: 'date', label: 'Дата', type: 'date' },
      { key: 'supplier_article', label: 'Артикул', type: 'text' },
      { key: 'quantity', label: 'На складе', type: 'number' },
      { key: 'in_way_to_client', label: 'В пути к клиенту', type: 'number' },
      { key: 'in_way_from_client', label: 'В пути от клиента', type: 'number' },
      { key: 'warehouse_name', label: 'Склад', type: 'text' },
      { key: 'subject', label: 'Предмет', type: 'text' },
      { key: 'category', label: 'Категория', type: 'text' },
      { key: 'brand', label: 'Бренд', type: 'text' },
      { key: 'price', label: 'Цена', type: 'currency' },
    ],
    incomes: [
      { key: 'date', label: 'Дата поступления', type: 'date' },
      { key: 'last_change_date', label: 'Последнее изменение', type: 'datetime' },
      { key: 'income_id', label: 'ID поступления', type: 'text' },
      { key: 'number', label: 'Номер', type: 'text' },
      { key: 'supplier_article', label: 'Артикул поставщика', type: 'text' },
      { key: 'tech_size', label: 'Размер', type: 'text' },
      { key: 'barcode', label: 'Штрихкод', type: 'text' },
      { key: 'quantity', label: 'Количество', type: 'number' },
      { key: 'total_price', label: 'Общая стоимость', type: 'currency' },
      { key: 'date_close', label: 'Дата закрытия', type: 'date' },
      { key: 'warehouse_name', label: 'Склад', type: 'text' },
      { key: 'nm_id', label: 'NM ID', type: 'text' },

    ]
  }

  return endpointHeaders[props.endpoint] || [];
})

const formatValue = (value, type) => {
  if (value === null || value === undefined) return '-'

  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2
      }).format(value);
    case 'percent':
      return `${value}%`;
    case 'date':
      return new Date(value).toLocaleDateString('ru-RU');
    case 'datetime':
      return new Date(value).toLocaleString('ru-RU');
    case 'boolean':
      return value ? 'Да' : 'Нет';
    default:
      return value;
  }
}
</script>

<template>
  <div class="data-table-container">
    <div v-if="loading" class="loading-state">
      <LoadingSpinner />
      <span>Загрузка данных...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="retry-btn">Повторить</button>
    </div>

    <div v-else-if="!data || data.length === 0" class="empty-state">
      <span>Нет данных для отображения</span>
    </div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
        <tr>
          <th v-for="header in headers" :key="header.key">
            {{ header.label }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td v-for="header in headers" :key="header.key">
            {{ formatValue(item[header.key], header.type) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.data-table-container {
  margin: 1rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}


.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
  color: #555;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #e63946;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #0056b3;
}


.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  min-width: 600px;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.95rem;
}

.data-table th {
  background: #f5f7fa;
  font-weight: 600;
  color: #2c3e50;
  padding: 0.8rem;
  text-align: left;
  border-bottom: 2px solid #e1e5eb;
  position: sticky;
  top: 0;
  z-index: 2;
  box-shadow: inset 0 -1px 0 #e1e5eb;
}

.data-table td {
  padding: 0.7rem;
  border-bottom: 1px solid #eaecef;
  color: #444;
}


.data-table tbody tr:nth-child(odd) td {
  background: #fcfcfd;
}

.data-table tr:last-child td {
  border-bottom: none;
}


.data-table tbody tr:hover td {
  background: #f0f6ff;
  transition: background 0.2s ease;
}


@media (max-width: 768px) {
  .data-table th, .data-table td {
    padding: 0.5rem 0.6rem;
    font-size: 0.85rem;
  }

  .retry-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .data-table {
    min-width: 400px;
  }
}
</style>


