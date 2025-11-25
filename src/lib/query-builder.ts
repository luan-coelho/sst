import type { FilterValue, Filters, QueryBuilderOptions, QueryParams, SortConfig } from '@/lib/types/filters'

/**
 * Constrói query string a partir de parâmetros estruturados
 * Suporta todos os padrões de filtros da API
 */
export class QueryBuilder {
    private params: URLSearchParams
    private options: Required<QueryBuilderOptions>

    constructor(options: QueryBuilderOptions = {}) {
        this.params = new URLSearchParams()
        this.options = {
            arrayFormat: options.arrayFormat ?? 'repeat',
            skipNull: options.skipNull ?? true,
            skipEmptyString: options.skipEmptyString ?? true,
            encodeValues: options.encodeValues ?? true
        }
    }

    /**
     * Adiciona paginação
     */
    addPagination(page?: number, size?: number): this {
        if (page !== undefined && page !== null) {
            this.params.append('page', String(page))
        }
        if (size !== undefined && size !== null) {
            this.params.append('size', String(size))
        }
        return this
    }

    /**
     * Adiciona busca textual
     */
    addSearch(query?: string): this {
        if (query && query.trim() !== '') {
            this.params.append('q', query.trim())
        }
        return this
    }

    /**
     * Adiciona ordenação
     * Suporta múltiplos campos e direções
     * @example
     * addSort('name') // ordenação crescente
     * addSort('-createdAt') // ordenação decrescente
     * addSort(['name', '-createdAt']) // múltiplas ordenações
     */
    addSort(sort?: string | Array<string> | Array<SortConfig>): this {
        if (!sort) return this

        const sortStrings: Array<string> = []

        if (Array.isArray(sort)) {
            sort.forEach(item => {
                if (typeof item === 'string') {
                    sortStrings.push(item)
                } else {
                    // SortConfig object
                    const prefix = item.direction === 'desc' ? '-' : ''
                    sortStrings.push(`${prefix}${item.field}`)
                }
            })
        } else {
            sortStrings.push(sort)
        }

        if (sortStrings.length > 0) {
            this.params.append('sort', sortStrings.join(','))
        }

        return this
    }

    /**
     * Adiciona filtros dinâmicos
     * Suporta operadores e campos aninhados
     */
    addFilters(filters?: Filters): this {
        if (!filters) return this

        Object.entries(filters).forEach(([key, value]) => {
            if (this.shouldSkipValue(value)) return

            // Valor com operador explícito
            if (this.isFilterValue(value)) {
                this.addFilterWithOperator(key, value)
                return
            }

            // Array de valores (OR)
            if (Array.isArray(value)) {
                this.addArrayFilter(key, value as Array<string | number | boolean>)
                return
            }

            // Valor simples (igualdade)
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                this.params.append(key, this.formatValue(value))
            }
        })

        return this
    }

    /**
     * Adiciona um único filtro com operador
     */
    private addFilterWithOperator(key: string, filter: FilterValue): void {
        const operator = filter.operator ?? 'eq'
        const value = filter.value

        if (Array.isArray(value)) {
            // Operador 'in' com múltiplos valores
            if (operator === 'in') {
                const formattedValues = value.map(v => this.formatValue(v)).join(',')
                this.params.append(`${key}[${operator}]`, formattedValues)
            } else {
                // Múltiplos filtros com o mesmo operador
                value.forEach(v => {
                    this.params.append(`${key}[${operator}]`, this.formatValue(v))
                })
            }
        } else {
            this.params.append(`${key}[${operator}]`, this.formatValue(value))
        }
    }

    /**
     * Adiciona múltiplos valores para o mesmo campo (OR lógico)
     */
    private addArrayFilter(key: string, values: Array<string | number | boolean>): void {
        if (this.options.arrayFormat === 'comma') {
            const formattedValues = values.map(v => this.formatValue(v)).join(',')
            this.params.append(key, formattedValues)
        } else if (this.options.arrayFormat === 'bracket') {
            const formattedValues = values.map(v => this.formatValue(v)).join(',')
            this.params.append(`${key}[]`, formattedValues)
        } else {
            // 'repeat' - padrão
            values.forEach(value => {
                this.params.append(key, this.formatValue(value))
            })
        }
    }

    /**
     * Constrói query completa a partir de objeto QueryParams
     */
    static build(params: QueryParams, options?: QueryBuilderOptions): string {
        const builder = new QueryBuilder(options)

        builder
            .addPagination(params.page, params.size)
            .addSearch(params.q)
            .addSort(params.sort)
            .addFilters(params.filters)

        return builder.toString()
    }

    /**
     * Retorna a query string construída
     */
    toString(): string {
        const queryString = this.params.toString()
        return queryString ? `?${queryString}` : ''
    }

    /**
     * Retorna os URLSearchParams
     */
    toURLSearchParams(): URLSearchParams {
        return this.params
    }

    /**
     * Formata valor para string
     */
    private formatValue(value: string | number | boolean): string {
        if (typeof value === 'boolean') {
            return value ? 'true' : 'false'
        }
        return String(value)
    }

    /**
     * Verifica se o valor deve ser ignorado
     */
    private shouldSkipValue(value: unknown): boolean {
        if (value === undefined || value === null) {
            return this.options.skipNull
        }
        if (value === '' && typeof value === 'string') {
            return this.options.skipEmptyString
        }
        return false
    }

    /**
     * Type guard para FilterValue
     */
    private isFilterValue(value: unknown): value is FilterValue {
        return (
            typeof value === 'object' &&
            value !== null &&
            'value' in value &&
            ('operator' in value || !('operator' in value))
        )
    }
}

/**
 * Helper functions para construção rápida de filtros
 */

/**
 * Cria um filtro de igualdade
 */
export function eq(value: string | number | boolean): FilterValue {
    return { operator: 'eq', value }
}

/**
 * Cria um filtro de diferença
 */
export function neq(value: string | number | boolean): FilterValue {
    return { operator: 'neq', value }
}

/**
 * Cria um filtro maior que
 */
export function gt(value: number | string): FilterValue {
    return { operator: 'gt', value }
}

/**
 * Cria um filtro maior ou igual
 */
export function gte(value: number | string): FilterValue {
    return { operator: 'gte', value }
}

/**
 * Cria um filtro menor que
 */
export function lt(value: number | string): FilterValue {
    return { operator: 'lt', value }
}

/**
 * Cria um filtro menor ou igual
 */
export function lte(value: number | string): FilterValue {
    return { operator: 'lte', value }
}

/**
 * Cria um filtro de substring (LIKE)
 */
export function like(value: string): FilterValue {
    return { operator: 'like', value }
}

/**
 * Cria um filtro IN (múltiplos valores)
 */
export function inArray(values: Array<string | number>): FilterValue {
    return { operator: 'in', value: values }
}

/**
 * Cria configuração de ordenação crescente
 */
export function sortAsc(field: string): SortConfig {
    return { field, direction: 'asc' }
}

/**
 * Cria configuração de ordenação decrescente
 */
export function sortDesc(field: string): SortConfig {
    return { field, direction: 'desc' }
}

/**
 * Helper para construir query string rapidamente
 */
export function buildQuery(params: QueryParams, options?: QueryBuilderOptions): string {
    return QueryBuilder.build(params, options)
}
