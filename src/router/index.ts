import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ApplicationsView from '@/views/ApplicationsView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/applications', name: 'Applications', component: ApplicationsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
