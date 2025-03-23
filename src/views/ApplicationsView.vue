<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api/apiClient'
import ApplicationDetailsModal from '@/components/ApplicationDetailsModal.vue'

const applications = ref([])
const isLoading = ref(true)
const error = ref('')
const selectedApplication = ref(null)
const showModal = ref(false)

// Filter states
const statusFilter = ref('')
const yearFilter = ref('')
const typeFilter = ref('')

const statusOptions = ['all', 'pending', 'accepted', 'rejected']
const typeOptions = ['all', 'new', 'renewal']

// Generate year options (current year and 3 years back)
const currentYear = new Date().getFullYear()
const yearOptions = ['all', ...Array.from({ length: 4 }, (_, i) => (currentYear - i).toString())]

const fetchApplications = async () => {
  isLoading.value = true
  error.value = ''

  console.log(1);
  try {
    const filters: Record<string, string> = {}

    if (statusFilter.value && statusFilter.value !== 'all') {
      filters.status = statusFilter.value
    }

    if (yearFilter.value && yearFilter.value !== 'all') {
      filters.year = yearFilter.value
    }

    if (typeFilter.value && typeFilter.value !== 'all') {
      filters.type = typeFilter.value
    }

    const response = await api.getApplications(Object.keys(filters).length ? filters : undefined)
    console.log(response)
    applications.value = response
  } catch (err) {
    error.value = 'Failed to load applications'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const openApplicationDetails = (application) => {
  selectedApplication.value = application
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedApplication.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

// Initial load
onMounted(fetchApplications)
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Applications</h1>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <h2 class="text-lg font-medium mb-3">Filters</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="statusFilter"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="fetchApplications"
          >
            <option v-for="option in statusOptions" :key="option" :value="option">
              {{ option === 'all' ? 'All Statuses' : option.charAt(0).toUpperCase() + option.slice(1) }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            v-model="yearFilter"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="fetchApplications"
          >
            <option v-for="option in yearOptions" :key="option" :value="option">
              {{ option === 'all' ? 'All Years' : option }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            v-model="typeFilter"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="fetchApplications"
          >
            <option v-for="option in typeOptions" :key="option" :value="option">
              {{ option === 'all' ? 'All Types' : option.charAt(0).toUpperCase() + option.slice(1) }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      <p class="mt-2 text-gray-600">Loading applications...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="applications.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <p class="text-gray-500">No applications found matching your criteria.</p>
    </div>

    <!-- Applications table -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GFF ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="application in applications" :key="application.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ application.applicant?.gff_id || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ application.applicant?.organization_name || 'Unknown Organization' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
              {{ application.type }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ application.year }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': application.status === 'accepted',
                  'bg-yellow-100 text-yellow-800': application.status === 'pending',
                  'bg-red-100 text-red-800': application.status === 'rejected'
                }"
              >
                {{ application.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button
                @click="openApplicationDetails(application)"
                class="text-blue-600 hover:text-blue-900 font-medium"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Application Details Modal -->
    <ApplicationDetailsModal
      v-if="showModal"
      :application="selectedApplication"
      @close="closeModal"
    />
  </div>
</template>
