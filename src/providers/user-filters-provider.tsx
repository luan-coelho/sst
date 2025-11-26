import { createFiltersProvider } from './filters-provider'
import type { QueryParams } from '@/lib/types/filters'
import type { FilterState } from '@/lib/types/user-filters'

const INITIAL_QUERY_PARAMS: QueryParams = {
    page: 0,
    size: 10,
    sort: '-createdAt',
    filters: {}
}

const INITIAL_FILTER_STATE: FilterState = {
    search: '',
    role: 'all',
    status: 'all'
}

function transformUserFilters(filters: FilterState) {
    return {
        q: filters.search || undefined,
        filters: {
            roles: filters.role === 'all' ? undefined : filters.role,
            active: filters.status === 'all' ? undefined : filters.status === 'active'
        }
    }
}

function countActiveUserFilters(filters: FilterState): number {
    return [filters.search, filters.role !== 'all', filters.status !== 'all'].filter(Boolean).length
}

const { FiltersProvider: UserFiltersProviderBase, useFiltersContext: useUserFiltersContextBase } =
    createFiltersProvider<FilterState>()

interface UserFiltersProviderProps {
    children: React.ReactNode
}

export function UserFiltersProvider({ children }: UserFiltersProviderProps) {
    return (
        <UserFiltersProviderBase
            initialQueryParams={INITIAL_QUERY_PARAMS}
            initialFilterState={INITIAL_FILTER_STATE}
            transformFilters={transformUserFilters}
            countActiveFilters={countActiveUserFilters}>
            {children}
        </UserFiltersProviderBase>
    )
}

export function useUserFiltersContext() {
    return useUserFiltersContextBase()
}
