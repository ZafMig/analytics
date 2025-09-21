<script setup>
import {ref, watch, computed} from "vue";
import {getWeekAgo, getToday} from "../utils/dateUtils.js";

const props = defineProps({
  endpoint: String,
  initialFilters: Object,
})

const emit = defineEmits(["filters-change"]);

const showDateTo = computed(() => props.endpoint !== "stocks");

const localFilters = ref ({
  dateFrom: props.initialFilters?.dateFrom || getWeekAgo(),
  dateTo: props.initialFilters?.dateTo || getToday(),
  limit: props.initialFilters?.limit || 50,
})

const updateFilters = () => {
  emit("filters-change", {...localFilters.value});
}

const resetFilters = () => {
  localFilters.value = {
    dateFrom: getWeekAgo(),
    dateTo: getToday(),
    limit: 50,
  }
  updateFilters()
}

watch(() => props.endpoint, (newEndpoint) => {
  if (newEndpoint === "stocks") {
    localFilters.value.dateTo = getWeekAgo();
  }
  updateFilters()
})
</script>

<template>
  <div class="filters-panel">
    <div class="filter-group">
      <label>Дата от:</label>
      <input
        type="date"
        v-model="localFilters.dateFrom"
        @change="updateFilters"
      />
    </div>
    <div class="filter-group" v-if="showDateTo">
      <label>Дата до:</label>
      <input
          type="date"
          v-model="localFilters.dateFrom"
          @change="updateFilters"
      />
    </div>

    <div class="filter-group">
      <label>Записей на странице:</label>
      <select v-model="localFilters.limit" @change="updateFilters">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="500">500</option>
      </select>
    </div>

    <button @click="resetFilters" class="reset-btn">Сбросить</button>
  </div>
</template>

<style scoped>
.filters-panel {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 12px;
  color: #2c3e50;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.9rem;
}

.filter-group input,
.filter-group select {
  padding: 0.6rem 1rem;
  border: 1px solid #dcdfe3;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #2c3e50;
  background: #fff;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filter-group input:focus,
.filter-group select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52,152,219,0.15);
}

.reset-btn {
  padding: 0.6rem 1.2rem;
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.reset-btn:hover {
  background-color: #ff3742;
  transform: translateY(-1px);
}


@media (max-width: 768px) {
  .filters-panel {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 1rem;
  }

  .filter-group input,
  .filter-group select,
  .reset-btn {
    width: 100%;
    font-size: 0.9rem;
    padding: 0.5rem 0.8rem;
  }

  .reset-btn {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .filter-group label {
    font-size: 0.85rem;
  }

  .reset-btn {
    font-size: 0.85rem;
  }
}
</style>

