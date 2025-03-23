<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  application: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const totalFunding = computed(() => {
  if (props.application?.payload?.funding?.total_funding) {
    return formatCurrency(props.application.payload.funding.total_funding)
  }
  return 'N/A'
})

const generalOperatingFunding = computed(() => {
  if (props.application?.payload?.funding?.general_operating_funding) {
    return formatCurrency(props.application.payload.funding.general_operating_funding)
  }
  return 'N/A'
})

const projectFunding = computed(() => {
  if (props.application?.payload?.funding?.project_funding) {
    return formatCurrency(props.application.payload.funding.project_funding)
  }
  return '$0.00'
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
        <h2 class="text-xl font-bold text-gray-800">Application Details</h2>
        <button 
          @click="$emit('close')" 
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <!-- Basic Information -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p class="text-sm text-gray-500">ID</p>
              <p class="font-medium">{{ application.id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Type</p>
              <p class="font-medium capitalize">{{ application.type }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Year</p>
              <p class="font-medium">{{ application.year }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <p class="font-medium">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': application.status === 'accepted',
                    'bg-yellow-100 text-yellow-800': application.status === 'pending',
                    'bg-red-100 text-red-800': application.status === 'rejected'
                  }"
                >
                  {{ application.status }}
                </span>
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Created At</p>
              <p class="font-medium">{{ formatDate(application.created_at) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Updated At</p>
              <p class="font-medium">{{ formatDate(application.updated_at) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Opening At</p>
              <p class="font-medium">{{ formatDate(application.opening_at) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Closing At</p>
              <p class="font-medium">{{ formatDate(application.closing_at) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Funding Information -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Funding Information</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="bg-white p-3 rounded shadow-sm">
                <p class="text-sm text-gray-500">Total Funding</p>
                <p class="text-xl font-bold text-blue-600">{{ totalFunding }}</p>
              </div>
              <div class="bg-white p-3 rounded shadow-sm">
                <p class="text-sm text-gray-500">General Operating</p>
                <p class="text-xl font-bold text-green-600">{{ generalOperatingFunding }}</p>
              </div>
              <div class="bg-white p-3 rounded shadow-sm">
                <p class="text-sm text-gray-500">Project Funding</p>
                <p class="text-xl font-bold text-purple-600">{{ projectFunding }}</p>
              </div>
            </div>
            
            <div v-if="application.payload?.funding?.source" class="mt-2">
              <p class="text-sm text-gray-500">Funding Source</p>
              <p class="font-medium">{{ application.payload.funding.source }}</p>
            </div>
            
            <div v-if="application.payload?.general_operating_funding?.explanation" class="mt-4 p-3 bg-white rounded">
              <p class="text-sm text-gray-500 mb-1">Explanation</p>
              <div class="prose prose-sm max-w-none" v-html="application.payload.general_operating_funding.explanation"></div>
            </div>
          </div>
        </div>
        
        <!-- Applicant Information -->
        <div v-if="application.payload?.applicant_info" class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Applicant Information</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div v-if="application.payload.applicant_info.email" class="mb-3">
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium">{{ application.payload.applicant_info.email }}</p>
            </div>
            
            <div v-if="application.payload.applicant_info.phone_number" class="mb-3">
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium">
                {{ application.payload.applicant_info.phone_country_code?.split('/')[2] || '' }} 
                {{ application.payload.applicant_info.phone_number }}
              </p>
            </div>
            
            <div v-if="application.payload.applicant_info.mailing_address" class="mb-3">
              <p class="text-sm text-gray-500 mb-1">Mailing Address</p>
              <div class="font-medium">
                <p v-if="application.payload.applicant_info.mailing_address.street_address_1">
                  {{ application.payload.applicant_info.mailing_address.street_address_1 }}
                </p>
                <p v-if="application.payload.applicant_info.mailing_address.street_address_2">
                  {{ application.payload.applicant_info.mailing_address.street_address_2 }}
                </p>
                <p v-if="application.payload.applicant_info.mailing_address.city || application.payload.applicant_info.mailing_address.state">
                  {{ application.payload.applicant_info.mailing_address.city }}, 
                  {{ application.payload.applicant_info.mailing_address.state }} 
                  {{ application.payload.applicant_info.mailing_address.postal_code }}
                </p>
                <p v-if="application.payload.applicant_info.mailing_address.country">
                  {{ application.payload.applicant_info.mailing_address.country.split('/')[1] || application.payload.applicant_info.mailing_address.country }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
