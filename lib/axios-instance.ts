import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from "axios"
import { getSession } from "next-auth/react"

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: number
}

// const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTI4MDg1ZjI0NGE2M2RiOTRjMmUxZWQiLCJlbWFpbCI6InNvemliYmRjYWxsaW5nMjAyNUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQzMDU0OTMsImV4cCI6MTc2NDM5MTg5M30.P582Zs5Rs1AE9vmUv9k6144DushP2MY4hUYamlFM2RU"

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    const session = await getSession()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    if (error.response?.status === 401 && originalRequest && !originalRequest.retry) {
      originalRequest.retry = 1

      try {
        const session = await getSession()
        if (session?.refreshToken) {
          // Call refresh token endpoint
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: session.refreshToken,
          })

          const { accessToken } = response.data.data

          // Update session and retry request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        // Redirect to login on refresh failure
        // if (typeof window !== "undefined") {
        //   window.location.href = "/auth/login"
        // }
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
