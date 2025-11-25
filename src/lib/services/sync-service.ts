import type {
    HierarchyByCompanyCode,
    SocCompanyApiData,
    SocJobApiData,
    SocSectorApiData,
    SocUnitApiData,
    SyncResponse
} from '@/lib/types/sync'
import { HttpClient } from '@/lib/http-client'

/**
 * Serviço para gerenciar sincronização de dados SOC
 */
export class SyncService {
    private readonly BASE_PATH = '/api/soc/sync'

    /**
     * Executa sincronização completa da API SOC
     * Busca dados diretamente da API SOC e persiste no banco de dados
     *
     * @returns Promise com o resultado da sincronização
     */
    async fullFromApi(): Promise<SyncResponse> {
        return HttpClient.post<SyncResponse>(`${this.BASE_PATH}/full-from-api`)
    }

    /**
     * Sincroniza apenas empresas
     *
     * @param companies - Array de empresas da API SOC
     * @returns Promise com o resultado da sincronização
     */
    async syncCompanies(companies: Array<SocCompanyApiData>): Promise<SyncResponse> {
        return HttpClient.post<SyncResponse>(`${this.BASE_PATH}/companies`, companies)
    }

    /**
     * Sincroniza apenas unidades
     *
     * @param units - Array de unidades da API SOC
     * @returns Promise com o resultado da sincronização
     */
    async syncUnits(units: Array<SocUnitApiData>): Promise<SyncResponse> {
        return HttpClient.post<SyncResponse>(`${this.BASE_PATH}/units`, units)
    }

    /**
     * Sincroniza apenas setores
     *
     * @param sectors - Array de setores da API SOC
     * @returns Promise com o resultado da sincronização
     */
    async syncSectors(sectors: Array<SocSectorApiData>): Promise<SyncResponse> {
        return HttpClient.post<SyncResponse>(`${this.BASE_PATH}/sectors`, sectors)
    }

    /**
     * Sincroniza apenas cargos
     *
     * @param jobs - Array de cargos da API SOC
     * @returns Promise com o resultado da sincronização
     */
    async syncJobs(jobs: Array<SocJobApiData>): Promise<SyncResponse> {
        return HttpClient.post<SyncResponse>(`${this.BASE_PATH}/jobs`, jobs)
    }

    /**
     * Processa hierarquias de empresas
     *
     * @param hierarchies - Objeto com hierarquias agrupadas por código da empresa
     * @returns Promise com o resultado do processamento
     */
    async processHierarchies(hierarchies: HierarchyByCompanyCode): Promise<SyncResponse> {
        return HttpClient.post<SyncResponse>(`${this.BASE_PATH}/hierarchies`, hierarchies)
    }
}

export const syncService = new SyncService()
