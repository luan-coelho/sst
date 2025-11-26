import type { QueryParams } from '@/lib/types/filters'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface FiltersContextData<TFilterState> {
    queryParams: QueryParams
    tempFilters: TFilterState
    appliedFilters: TFilterState
    activeFiltersCount: number
    setTempFilters: React.Dispatch<React.SetStateAction<TFilterState>>
    applyFilters: () => void
    clearFilters: () => void
    changePage: (page: number) => void
    changePageSize: (size: number) => void
    changeSort: (sort: string) => void
}

function createFiltersContext<TFilterState>() {
    return createContext<FiltersContextData<TFilterState> | undefined>(undefined)
}

interface FiltersProviderProps<TFilterState> {
    children: React.ReactNode
    initialQueryParams: QueryParams
    initialFilterState: TFilterState
    transformFilters: (filters: TFilterState) => { filters?: QueryParams['filters']; q?: string }
    countActiveFilters?: (filters: TFilterState) => number
}

export function createFiltersProvider<TFilterState>() {
    const FiltersContext = createFiltersContext<TFilterState>()

    function FiltersProvider({
        children,
        initialQueryParams,
        initialFilterState,
        transformFilters,
        countActiveFilters
    }: FiltersProviderProps<TFilterState>) {
        const [queryParams, setQueryParams] = useState<QueryParams>(initialQueryParams)
        const [tempFilters, setTempFilters] = useState<TFilterState>(initialFilterState)
        const [appliedFilters, setAppliedFilters] = useState<TFilterState>(initialFilterState)

        const activeFiltersCount = useMemo(() => {
            if (countActiveFilters) {
                return countActiveFilters(appliedFilters)
            }
            return 0
        }, [appliedFilters, countActiveFilters])

        const applyFilters = useCallback(() => {
            setAppliedFilters(tempFilters)
            const transformed = transformFilters(tempFilters)
            setQueryParams(prev => ({
                ...prev,
                page: 0,
                q: transformed.q,
                filters: transformed.filters
            }))
        }, [tempFilters, transformFilters])

        const clearFilters = useCallback(() => {
            setTempFilters(initialFilterState)
            setAppliedFilters(initialFilterState)
            setQueryParams(initialQueryParams)
        }, [initialFilterState, initialQueryParams])

        const changePage = useCallback((page: number) => {
            setQueryParams(prev => ({ ...prev, page }))
        }, [])

        const changePageSize = useCallback((size: number) => {
            setQueryParams(prev => ({ ...prev, size, page: 0 }))
        }, [])

        const changeSort = useCallback((sort: string) => {
            setQueryParams(prev => ({ ...prev, sort }))
        }, [])

        const value = useMemo(
            () => ({
                queryParams,
                tempFilters,
                appliedFilters,
                activeFiltersCount,
                setTempFilters,
                applyFilters,
                clearFilters,
                changePage,
                changePageSize,
                changeSort
            }),
            [
                queryParams,
                tempFilters,
                appliedFilters,
                activeFiltersCount,
                applyFilters,
                clearFilters,
                changePage,
                changePageSize,
                changeSort
            ]
        )

        return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
    }

    function useFiltersContext() {
        const context = useContext(FiltersContext)

        if (!context) {
            throw new Error('useFiltersContext must be used within a FiltersProvider')
        }

        return context
    }

    return { FiltersProvider, useFiltersContext }
}
