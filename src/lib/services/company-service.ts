import { BaseService } from './base-service'

/**
 * Serviço para gerenciar empresas
 */
export class SocCompanyService extends BaseService {
    constructor() {
        super('/api/soc/companies')
    }
}

export const socCompanyService = new SocCompanyService()
