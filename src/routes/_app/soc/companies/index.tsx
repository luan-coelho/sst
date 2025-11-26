import { ErrorState } from '@/components/error-state'
import { CompaniesFilterSheet } from '@/components/soc-companies-filter-sheet'
import { SocCompaniesTable } from '@/components/soc-companies-table'
import { SyncButton } from '@/components/soc-sync-button'
import { Badge } from '@/components/ui/badge'
import { socCompanyService } from '@/lib/services/company-service'
import type { SocCompany } from '@/lib/types/soc'
import { SocCompanyFiltersProvider, useSocCompanyFiltersContext } from '@/providers/company-filters-provider'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'

export const Route = createFileRoute('/_app/soc/companies/')({
    component: CompaniesPage
})

function CompaniesPage() {
    return (
        <SocCompanyFiltersProvider>
            <RouteComponent />
        </SocCompanyFiltersProvider>
    )
}

function RouteComponent() {
    const { queryParams, activeFiltersCount } = useSocCompanyFiltersContext()

    const { data, isLoading, error } = useQuery({
        queryKey: ['soc-companies', queryParams],
        queryFn: () => socCompanyService.getAll<SocCompany>(queryParams),
        placeholderData: prev => prev
    })

    if (error) {
        return <ErrorState title="Erro ao carregar empresas" message={error.message} />
    }

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col items-start justify-end">
                    <div className="mb-2 flex items-center gap-2">
                        <Building2 className="text-primary h-8 w-8" />
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Empresas</h1>
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Visualize e gerencie as empresas do sistema
                    </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                            {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo
                            {activeFiltersCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                    <div className="flex gap-2">
                        <SyncButton />
                        <CompaniesFilterSheet className="w-full sm:w-auto" />
                    </div>
                </div>
            </div>

            <SocCompaniesTable
                companies={data?.content ?? []}
                isLoading={isLoading}
                pagination={
                    data
                        ? {
                              page: queryParams.page ?? 0,
                              pageSize: queryParams.size ?? 10,
                              totalPages: data.totalPages,
                              totalElements: data.totalElements
                          }
                        : undefined
                }
            />
        </div>
    )
}
