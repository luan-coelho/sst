import { ApiError } from '@/lib/types/api'
import { authClient } from './auth-client'
import { getApiUrl } from './env-config'

/**
 * Cliente HTTP com suporte a autenticação JWT
 * Adiciona automaticamente o token de acesso nas requisições
 */
export class HttpClient {
    /**
     * Realiza uma requisição HTTP com autenticação
     */
    static async fetch<T>(url: string, options: RequestInit = {}): Promise<T> {
        const fullUrl = url.startsWith('http') ? url : `${getApiUrl()}${url}`

        const { data } = await authClient.getAccessToken({ providerId: 'keycloak' })

        // Adiciona o token de acesso no header
        const headers = new Headers(options.headers)
        if (data?.accessToken && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${data.accessToken}`)
        }
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json')
        }

        try {
            let response = await fetch(fullUrl, {
                ...options,
                headers,
                credentials: 'include'
            })

            if (response.status === 401) {
                authClient.signOut()
            }

            if (!response.ok) {
                const error = await response.json()
                throw new ApiError(
                    error.error?.message || 'Erro na requisição',
                    error.error?.code || 'UNKNOWN_ERROR',
                    error.error?.details
                )
            }

            // Se a resposta estiver vazia, retorna objeto vazio
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                return {} as T
            }

            return response.json()
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(error instanceof Error ? error.message : 'Erro desconhecido', 'NETWORK_ERROR')
        }
    }

    /**
     * Método GET
     */
    static async get<T>(url: string, options?: RequestInit): Promise<T> {
        return this.fetch<T>(url, { ...options, method: 'GET' })
    }

    /**
     * Método POST
     */
    static async post<T>(url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.fetch<T>(url, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        })
    }

    /**
     * Método PUT
     */
    static async put<T>(url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.fetch<T>(url, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined
        })
    }

    /**
     * Método PATCH
     */
    static async patch<T>(url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.fetch<T>(url, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined
        })
    }

    /**
     * Método DELETE
     */
    static async delete<T>(url: string, options?: RequestInit): Promise<T> {
        return this.fetch<T>(url, { ...options, method: 'DELETE' })
    }
}
