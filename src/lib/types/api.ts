/**
 * Estrutura padrão de resposta da API
 */
export interface ApiResponseSucess<T> {
    success: true
    data: T
}

export interface ApiResponseError {
    success: false
    error: {
        code: string
        message: string
        details?: Array<FieldError>
    }
}

export interface FieldError {
    field: string
    message: string
}

/**
 * Classe customizada de erro para APIs
 */
export class ApiError extends Error {
    code: string
    details?: Array<FieldError>

    constructor(message: string, code: string, details?: Array<FieldError>) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        this.details = details
    }
}

export interface PaginatedResponse<T> {
    content: Array<T>
    page: number
    size: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
    numberOfElements: number
    empty: boolean
}
