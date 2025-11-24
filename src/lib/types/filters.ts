/**
 * Operadores de filtro suportados pela API
 */
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in'

/**
 * Direção de ordenação
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Valor de filtro com operador
 */
export interface FilterValue {
    operator?: FilterOperator
    value: string | number | boolean | Array<string | number>
}

/**
 * Estrutura de filtros dinâmicos
 */
export interface Filters {
    [key: string]: string | number | boolean | Array<string | number> | FilterValue | undefined
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
    page?: number
    size?: number
}

/**
 * Parâmetros de ordenação
 */
export interface SortParams {
    sort?: string | Array<string> | Array<SortConfig>
}

/**
 * Parâmetros de busca textual
 */
export interface SearchParams {
    q?: string
}

/**
 * Parâmetros completos de query
 */
export interface QueryParams extends PaginationParams, SortParams, SearchParams {
    filters?: Filters
}

/**
 * Configuração de ordenação estruturada
 */
export interface SortConfig {
    field: string
    direction: SortDirection
}

/**
 * Opções para construção de query string
 */
export interface QueryBuilderOptions {
    arrayFormat?: 'repeat' | 'comma' | 'bracket'
    skipNull?: boolean
    skipEmptyString?: boolean
    encodeValues?: boolean
}
