<template>
  <div id="app">
    <nav class="main-nav">
      <div class="nav-container">
        <h1 class="nav-title">Analytics</h1>
        <div class="nav-links">
          <router-link to="/sales">Продажи</router-link>
          <router-link to="/orders">Заказы</router-link>
          <router-link to="/stocks">Склады</router-link>
          <router-link to="/incomes">Доходы</router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style>
.main-nav {
  background: #2c3e50; /* тёмный фон */
  padding: 0.8rem 1rem;
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* лёгкая тень */
  position: sticky;
  top: 0;
  z-index: 1000;
  border-radius: 15px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 0.75rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.nav-links a.router-link-active {
  background: #3498db;
  color: #fff;
}

.nav-links a:hover {
  background: #3d566e;
}

.main-content {
  padding: 2rem;

  margin: 0 auto;
}

.page {
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
</style>
