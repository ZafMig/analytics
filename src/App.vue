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
        <button class="nav-toggle" @click="toggleMenu">☰</button>
      </div>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  const links = document.querySelector('.nav-links')
  if (isMenuOpen.value) links.style.display = 'flex'
  else links.style.display = 'none'
}
</script>

<style>
.main-nav {
  background: #2c3e50;
  padding: 0.8rem 1rem;
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-radius: 12px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 0.75rem;
}

.nav-links a {
  background: #3498db;
  color: #fff;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.25s ease;
}

.nav-links a:hover {
  background: #3d566e;
}

.nav-toggle {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}


.main-content {
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
}


@media (max-width: 768px) {
  .nav-links {
    flex-direction: column;
    display: none;
    gap: 0.5rem;
    width: 100%;
    margin-top: 0.75rem;
  }

  .nav-toggle {
    display: block;
  }

  .nav-container {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
