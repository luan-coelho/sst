import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
    HierarchyByCompanyCode,
    SocCompanyApiData,
    SocJobApiData,
    SocSectorApiData,
    SocUnitApiData,
    SyncResponse
} from '@/lib/types/sync'
import { syncService } from '@/lib/services/sync-service'

/**
 * Hook para gerenciar ações de sincronização SOC
 */
export function useSyncActions() {
    const queryClient = useQueryClient()

    function handleSuccess(response: SyncResponse) {
        if (response.status === 'SUCCESS') {
            const details = []
            if (response.companies) details.push(`${response.companies} empresas`)
            if (response.units) details.push(`${response.units} unidades`)
            if (response.sectors) details.push(`${response.sectors} setores`)
            if (response.jobs) details.push(`${response.jobs} cargos`)
            if (response.hierarchyCompanies) details.push(`${response.hierarchyCompanies} hierarquias`)

            toast.success(response.message, {
                description: details.length > 0 ? `Sincronizado: ${details.join(', ')}` : undefined
            })

            queryClient.invalidateQueries({ queryKey: ['soc-companies'] })
        } else {
            toast.error('Erro na sincronização', {
                description: response.error || response.message
            })
        }
    }

    function handleError(error: Error) {
        toast.error('Erro ao executar sincronização', {
            description: error.message
        })
    }

    const fullFromApiMutation = useMutation({
        mutationFn: () => syncService.fullFromApi(),
        onSuccess: handleSuccess,
        onError: handleError
    })

    const syncCompaniesMutation = useMutation({
        mutationFn: (companies: Array<SocCompanyApiData>) => syncService.syncCompanies(companies),
        onSuccess: handleSuccess,
        onError: handleError
    })

    const syncUnitsMutation = useMutation({
        mutationFn: (units: Array<SocUnitApiData>) => syncService.syncUnits(units),
        onSuccess: handleSuccess,
        onError: handleError
    })

    const syncSectorsMutation = useMutation({
        mutationFn: (sectors: Array<SocSectorApiData>) => syncService.syncSectors(sectors),
        onSuccess: handleSuccess,
        onError: handleError
    })

    const syncJobsMutation = useMutation({
        mutationFn: (jobs: Array<SocJobApiData>) => syncService.syncJobs(jobs),
        onSuccess: handleSuccess,
        onError: handleError
    })

    const processHierarchiesMutation = useMutation({
        mutationFn: (hierarchies: HierarchyByCompanyCode) => syncService.processHierarchies(hierarchies),
        onSuccess: handleSuccess,
        onError: handleError
    })

    return {
        fullFromApi: fullFromApiMutation.mutate,
        syncCompanies: syncCompaniesMutation.mutate,
        syncUnits: syncUnitsMutation.mutate,
        syncSectors: syncSectorsMutation.mutate,
        syncJobs: syncJobsMutation.mutate,
        processHierarchies: processHierarchiesMutation.mutate,
        isLoading:
            fullFromApiMutation.isPending ||
            syncCompaniesMutation.isPending ||
            syncUnitsMutation.isPending ||
            syncSectorsMutation.isPending ||
            syncJobsMutation.isPending ||
            processHierarchiesMutation.isPending
    }
}
