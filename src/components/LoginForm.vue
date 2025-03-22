<script setup lang="ts">
import { ref } from 'vue'
import { api } from '../lib/api/apiClient'
import type { LoginRequest } from '../lib/api/types'

const emit = defineEmits(['login'])

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password'
    return
  }

  try {
    loading.value = true
    error.value = null
    
    const credentials: LoginRequest = {
      username: username.value,
      password: password.value
    }
    
    await api.login(credentials)
    emit('login')
  } catch (err) {
    error.value = 'Invalid username or password'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md">
      <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        
        <div v-if="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ error }}</span>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Username
          </label>
          <input 
            v-model="username"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="username" 
            type="text" 
            placeholder="Username"
            :disabled="loading"
          >
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input 
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
            id="password" 
            type="password" 
            placeholder="******************"
            :disabled="loading"
          >
        </div>
        
        <div class="flex items-center justify-between">
          <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            :disabled="loading"
          >
            <span v-if="loading">Logging in...</span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </form>
      <p class="text-center text-gray-500 text-xs">
        &copy; 2025 Your Company. All rights reserved.
      </p>
    </div>
  </div>
</template>
