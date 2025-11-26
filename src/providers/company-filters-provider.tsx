import { createFiltersProvider } from './filters-provider'
import type { SocCompanyFilterState } from '@/lib/types/company-filters'
import type { QueryParams } from '@/lib/types/filters'

const INITIAL_QUERY_PARAMS: QueryParams = {
    page: 0,
    size: 10,
    sort: '-createdAt',
    filters: {}
}

const INITIAL_FILTER_STATE: SocCompanyFilterState = {
    search: '',
    status: 'all',
    riskDegree: 'all'
}

function transformSocCompanyFilters(filters: SocCompanyFilterState) {
    return {
        q: filters.search || undefined,
        filters: {
            active: filters.status === 'all' ? undefined : filters.status === 'active',
            riskDegree: filters.riskDegree === 'all' ? undefined : filters.riskDegree
        }
    }
}

function countActiveSocCompanyFilters(filters: SocCompanyFilterState): number {
    return [filters.search, filters.status !== 'all', filters.riskDegree !== 'all'].filter(Boolean).length
}

const { FiltersProvider: SocCompanyFiltersProviderBase, useFiltersContext: useSocCompanyFiltersContextBase } =
    createFiltersProvider<SocCompanyFilterState>()

interface SocCompanyFiltersProviderProps {
    children: React.ReactNode
}

export function SocCompanyFiltersProvider({ children }: SocCompanyFiltersProviderProps) {
    return (
        <SocCompanyFiltersProviderBase
            initialQueryParams={INITIAL_QUERY_PARAMS}
            initialFilterState={INITIAL_FILTER_STATE}
            transformFilters={transformSocCompanyFilters}
            countActiveFilters={countActiveSocCompanyFilters}>
            {children}
        </SocCompanyFiltersProviderBase>
    )
}

export function useSocCompanyFiltersContext() {
    return useSocCompanyFiltersContextBase()
}
