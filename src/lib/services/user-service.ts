import { HttpClient } from '@/lib/http-client'
import { ApiResponseSucess, type PaginatedResponse } from '@/lib/types/api'
import type { QueryParams } from '@/lib/types/filters'
import type { UserSchema } from '@/lib/types/user'
import { buildQuery } from '../query-builder'

/**
 * Serviço para gerenciar usuários
 */
export class UserService {
    private readonly BASE_PATH = '/api/users'

    async list(params: QueryParams = {}): Promise<PaginatedResponse<UserSchema>> {
        const queryString = buildQuery(params)
        const url = `${this.BASE_PATH}${queryString}`

        return HttpClient.get<PaginatedResponse<UserSchema>>(url)
    }

    /**
     * Busca um usuário por ID
     *
     * @param id - ID do usuário
     * @returns Promise com o usuário encontrado
     */
    async findById(id: string): Promise<UserSchema> {
        const response = await HttpClient.get<ApiResponseSucess<UserSchema>>(`${this.BASE_PATH}/${id}`)
        return response.data
    }

    /**
     * Cria um novo usuário
     *
     * @param data - Dados do usuário a ser criado
     * @returns Promise com o usuário criado
     */
    async create(data: Partial<UserSchema>): Promise<UserSchema> {
        const response = await HttpClient.post<ApiResponseSucess<UserSchema>>(this.BASE_PATH, data)
        return response.data
    }

    /**
     * Atualiza um usuário existente
     *
     * @param id - ID do usuário
     * @param data - Dados a serem atualizados
     * @returns Promise com o usuário atualizado
     */
    async update(id: string, data: Partial<UserSchema>): Promise<UserSchema> {
        const response = await HttpClient.put<ApiResponseSucess<UserSchema>>(`${this.BASE_PATH}/${id}`, data)
        return response.data
    }

    /**
     * Remove um usuário
     *
     * @param id - ID do usuário a ser removido
     * @returns Promise vazia
     */
    async delete(id: string): Promise<void> {
        return HttpClient.delete<void>(`${this.BASE_PATH}/${id}`)
    }
}

export const userService = new UserService()
