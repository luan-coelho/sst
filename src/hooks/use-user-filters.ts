import type { QueryParams } from '@/lib/types/filters'
import type { FilterState } from '@/lib/types/user-filters'
import { useCallback, useMemo, useState } from 'react'

interface UseUserFiltersReturn {
    queryParams: QueryParams
    tempFilters: FilterState
    appliedFilters: FilterState
    activeFiltersCount: number
    setTempFilters: React.Dispatch<React.SetStateAction<FilterState>>
    applyFilters: () => void
    clearFilters: () => void
    changePage: (page: number) => void
}

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

export function useUserFilters(): UseUserFiltersReturn {
    const [queryParams, setQueryParams] = useState<QueryParams>(INITIAL_QUERY_PARAMS)
    const [tempFilters, setTempFilters] = useState<FilterState>(INITIAL_FILTER_STATE)
    const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTER_STATE)

    const activeFiltersCount = useMemo(
        () =>
            [appliedFilters.search, appliedFilters.role !== 'all', appliedFilters.status !== 'all'].filter(Boolean)
                .length,
        [appliedFilters]
    )

    const applyFilters = useCallback(() => {
        setAppliedFilters(tempFilters)
        setQueryParams(prev => ({
            ...prev,
            page: 0,
            q: tempFilters.search || undefined,
            filters: {
                ...prev.filters,
                roles: tempFilters.role === 'all' ? undefined : tempFilters.role,
                active: tempFilters.status === 'all' ? undefined : tempFilters.status === 'active'
            }
        }))
    }, [tempFilters])

    const clearFilters = useCallback(() => {
        setTempFilters(INITIAL_FILTER_STATE)
        setAppliedFilters(INITIAL_FILTER_STATE)
        setQueryParams(INITIAL_QUERY_PARAMS)
    }, [])

    const changePage = useCallback((page: number) => {
        setQueryParams(prev => ({ ...prev, page }))
    }, [])

    return {
        queryParams,
        tempFilters,
        appliedFilters,
        activeFiltersCount,
        setTempFilters,
        applyFilters,
        clearFilters,
        changePage
    }
}
