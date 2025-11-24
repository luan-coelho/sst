import { HttpClient } from '@/lib/http-client'
import { ApiResponseSucess, type PaginatedResponse } from '@/lib/types/api'
import type { QueryParams } from '@/lib/types/filters'
import type { SocCompany } from '@/lib/types/soc'
import { buildQuery } from '../query-builder'

/**
 * Serviço para gerenciar empresas
 */
export class SocCompanyService {
    private readonly BASE_PATH = '/api/soc/companies'

    async list(params: QueryParams = {}): Promise<PaginatedResponse<SocCompany>> {
        const queryString = buildQuery(params)
        const url = `${this.BASE_PATH}${queryString}`

        return HttpClient.get<PaginatedResponse<SocCompany>>(url)
    }

    /**
     * Busca uma empresa por ID
     *
     * @param id - ID da empresa
     * @returns Promise com a empresa encontrada
     */
    async findById(id: string): Promise<SocCompany> {
        const response = await HttpClient.get<ApiResponseSucess<SocCompany>>(`${this.BASE_PATH}/${id}`)
        return response.data
    }
}

export const socCompanyService = new SocCompanyService()
