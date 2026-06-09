import apiClient from './client'

export interface HealthResponse {
  status: string
}

export const getHealth = (): Promise<HealthResponse> =>
  apiClient.get<HealthResponse>('/health').then((res) => res.data)
