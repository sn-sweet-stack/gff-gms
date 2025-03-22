import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './index.css' // Import Tailwind CSS

// Environment variables are automatically loaded by Vite
// Log API configuration for debugging
console.log('API Configuration:')
console.log(`API Base URL: ${import.meta.env.VITE_API_BASE_URL}`)
console.log(`Using Mock API: ${import.meta.env.VITE_USE_MOCK_API}`)

const app = createApp(App)
app.use(router)
app.mount('#app')
