import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";



export const useApiStore = defineStore('api', () => {

    const data = ref([])
    const loading = ref(false);
    const error = ref(null);
    const currentPage = ref(1);
    const totalItems = ref(0);
    const itemsPerPage = ref(50);
    const lastEndpoint = ref('');

    // Получаем настройки из environment variables
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    const API_KEY = import.meta.env.VITE_API_KEY
    const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000

    // Валидация обязательных переменных
    if (!API_BASE_URL) {
        throw new Error('VITE_API_BASE_URL is not defined in environment variables')
    }

    if (!API_KEY) {
        throw new Error('VITE_API_KEY is not defined in environment variables')
    }

    const apiClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: API_TIMEOUT,
        params: {
            key: API_KEY
        }
    })

    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error('API Request Failed:', error);
            return Promise.reject(error);
        }
    );

    const setPage = (page) => {
        if (page > 0) {
            currentPage.value = page;
        }
    }

    const setItemsPerPage = (limit) => {
        if (limit > 0 && limit <= 500) {
            itemsPerPage.value = limit;
        }
    }

    const fetchEndpointData = async (endpoint, filters = {}) => {
        loading.value = true;
        error.value = null;
        lastEndpoint.value = endpoint;

        try {
            const params = {
                ...filters,
                page: currentPage.value,
                limit: itemsPerPage.value,
            }

            Object.keys(params).forEach(key => {
                if (params[key] === null || params[key] === undefined || params[key] === '') {
                    delete params[key];
                }
            })

            console.log('🔄 API Request:', { endpoint, params });

            const response = await apiClient.get(`/api/${endpoint}`, { params });
            const responseData = response.data;

            console.log('✅ API Response:', responseData);

            if (responseData && responseData.data) {
                data.value = responseData.data;
                totalItems.value = responseData.meta?.total || 0;
            } else if (Array.isArray(responseData)) {
                data.value = responseData;
                totalItems.value = responseData.length;
            } else if (responseData && typeof responseData === 'object') {
                data.value = Object.values(responseData);
                totalItems.value = data.value.length;
            } else {
                data.value = [];
                totalItems.value = 0;
            }

        } catch (err) {
            error.value = err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Ошибка загрузки данных";

            console.error('❌ API Error:', err);

            data.value = [];
            totalItems.value = 0;
        } finally {
            loading.value = false;
        }
    }

    const refetch = () => {
        if (lastEndpoint.value) {
            fetchEndpointData(lastEndpoint.value);
        }
    }


    return {
        data,
        loading,
        error,
        currentPage,
        totalItems,
        itemsPerPage,
        lastEndpoint,

        fetchEndpointData,
        setPage,
        setItemsPerPage,
        refetch
    }
})