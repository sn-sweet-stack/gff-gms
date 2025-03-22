<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from './lib/api/apiClient'
import type { AppState } from './lib/api/types'
import LoginForm from './components/LoginForm.vue'
import AppLayout from './components/AppLayout.vue'

const appState = ref<AppState | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchAppState = async () => {
  try {
    loading.value = true
    error.value = null
    appState.value = await api.getAppState()
  } catch (err) {
    error.value = 'Failed to load application state'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  await fetchAppState()
}

onMounted(() => {
  fetchAppState()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p class="mt-4 text-gray-700">Loading...</p>
      </div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
        <button @click="fetchAppState" class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Retry
        </button>
      </div>
    </div>

    <template v-else>
      <LoginForm v-if="!appState?.loggedIn" @login="handleLogin" />
      <AppLayout v-else :user="appState?.user" @logout="fetchAppState" />
    </template>
  </div>
</template>

<style scoped>
/* Additional styles can be added here */
</style>
