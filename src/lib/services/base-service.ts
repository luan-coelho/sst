import { HttpClient } from '../http-client'
import { buildQuery } from '../query-builder'
import { ApiResponseSucess, PaginatedResponse } from '../types/api'
import { QueryParams } from '../types/filters'

export abstract class BaseService {
    protected baseUrl: string = 'http://localhost:8081'
    protected uri: string

    constructor(uri: string) {
        this.uri = uri
    }

    protected get url(): string {
        return `${this.baseUrl}${this.uri}`
    }

    public async getAll<T>(params: QueryParams = {}): Promise<PaginatedResponse<T>> {
        const queryString = buildQuery(params)
        const url = `${this.url}${queryString}`

        return HttpClient.get<PaginatedResponse<T>>(url)
    }

    public async getById<T>(id: string): Promise<T> {
        const response = await HttpClient.get<ApiResponseSucess<T>>(`${this.url}/${id}`)
        return response.data
    }

    public async create<T>(data: Partial<T>): Promise<T> {
        const response = await HttpClient.post<ApiResponseSucess<T>>(this.url, data)
        return response.data
    }

    public async updateById<T>(id: string, data: Partial<T>): Promise<T> {
        const response = await HttpClient.put<ApiResponseSucess<T>>(`${this.url}/${id}`, data)
        return response.data
    }

    public async deleteById(id: string): Promise<void> {
        return HttpClient.delete<void>(`${this.url}/${id}`)
    }
}
