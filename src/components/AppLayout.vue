<script setup lang="ts">
import { api } from '../lib/api/apiClient'
import type { User } from '../lib/api/types'

const props = defineProps<{
  user: User | null
}>()

const emit = defineEmits(['logout'])

const handleLogout = async () => {
  await api.logout()
  emit('logout')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <h1 class="text-xl font-bold">Application Dashboard</h1>
          <nav class="hidden md:flex space-x-4">
            <router-link 
              to="/" 
              class="text-white hover:text-blue-200 px-2 py-1 rounded transition"
              active-class="bg-blue-700"
            >
              Home
            </router-link>
            <router-link 
              to="/applications" 
              class="text-white hover:text-blue-200 px-2 py-1 rounded transition"
              active-class="bg-blue-700"
            >
              Applications
            </router-link>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <div v-if="user" class="text-sm">
            <span class="mr-2">{{ user.username }}</span>
            <span class="bg-blue-700 px-2 py-1 rounded text-xs">{{ user.role }}</span>
          </div>
          <button 
            @click="handleLogout" 
            class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Welcome, {{ user?.username }}!</h2>
        <p class="text-gray-600">
          You are logged in as a <strong>{{ user?.role }}</strong> user.
        </p>
        
        <div class="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 class="font-medium text-gray-700 mb-2">User Information</h3>
          <ul class="space-y-2 text-sm">
            <li><strong>ID:</strong> {{ user?.id }}</li>
            <li><strong>Email:</strong> {{ user?.email }}</li>
            <li><strong>Role:</strong> {{ user?.role }}</li>
          </ul>
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-100 border-t border-gray-200 py-4">
      <div class="container mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; 2025 Your Company. All rights reserved.
      </div>
    </footer>
  </div>
</template>
