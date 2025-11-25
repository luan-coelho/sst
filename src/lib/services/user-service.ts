import { BaseService } from './base-service'

/**
 * Serviço para gerenciar usuários
 */
export class UserService extends BaseService {
    constructor() {
        super('/api/users')
    }
}

export const userService = new UserService()
