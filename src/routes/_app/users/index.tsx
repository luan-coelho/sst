import { CreateUserDialog } from '@/components/create-user-dialog'
import { ErrorState } from '@/components/error-state'
import { Badge } from '@/components/ui/badge'
import { UsersFilterSheet } from '@/components/users-filter-sheet'
import { UsersTable } from '@/components/users-table'
import { userService } from '@/lib/services/user-service'
import type { UserSchema } from '@/lib/types/user'
import { UserFiltersProvider, useUserFiltersContext } from '@/providers/user-filters-provider'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/users/')({
    component: UsersPageComponent
})

function UsersPageComponent() {
    return (
        <UserFiltersProvider>
            <RouteComponent />
        </UserFiltersProvider>
    )
}

function RouteComponent() {
    const { queryParams, activeFiltersCount } = useUserFiltersContext()

    const { data, isLoading, error } = useQuery({
        queryKey: ['users', queryParams],
        queryFn: () => userService.getAll<UserSchema>(queryParams),
        placeholderData: prev => prev
    })

    if (error) {
        return <ErrorState title="Erro ao carregar usuários" message={error.message} />
    }

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col items-start justify-end">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Usuários</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Gerencie os usuários do sistema</p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                            {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo
                            {activeFiltersCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                    <UsersFilterSheet className="w-full sm:w-auto" />
                    <CreateUserDialog className="w-full sm:w-auto" />
                </div>
            </div>

            <UsersTable
                users={data?.content ?? []}
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
