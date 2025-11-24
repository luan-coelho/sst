import { HttpClient } from '@/lib/http-client'
import { ApiResponseSucess } from '@/lib/types/api'
import type { SocUnit } from '@/lib/types/soc'

/**
 * Serviço para gerenciar unidades
 */
export class SocUnitService {
    private readonly BASE_PATH = '/api/soc/units'

    /**
     * Busca uma unidade por ID
     *
     * @param id - ID da unidade
     * @returns Promise com a unidade encontrada
     */
    async findById(id: string): Promise<SocUnit> {
        const response = await HttpClient.get<ApiResponseSucess<SocUnit>>(`${this.BASE_PATH}/${id}`)
        return response.data
    }
}

export const socUnitService = new SocUnitService()
