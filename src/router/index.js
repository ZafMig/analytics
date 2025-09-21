import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/sales'
    },
    {
        path: '/sales',
        name: 'Sales',
        component: () => import('../views/SalesView.vue')
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/OrdersView.vue')
    },
    {
        path: '/stocks',
        name: 'Stocks',
        component: () => import('../views/StocksView.vue')
    },
    {
        path: '/incomes',
        name: 'Incomes',
        component: () => import('../views/IncomesView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // Добавьте это
    routes
})

export default router