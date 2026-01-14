import axios from 'axios'
import { supabase } from '@/lib/supabase/client'

// Legacy Axios client for backward compatibility
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - sign out from Supabase
      await supabase.auth.signOut()
      localStorage.removeItem('token')
      window.location.href = '/giris'
    }
    return Promise.reject(error)
  }
)

// Default export is now Supabase for new code
export { axiosClient }
export default axiosClient
