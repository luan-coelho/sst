import { Building2, ChevronDown, Database, GitBranch, Loader2, Network, RefreshCw, Users } from 'lucide-react'
import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useSyncActions } from '@/hooks/use-sync-actions'

type SyncAction = 'full' | 'companies' | 'units' | 'sectors' | 'jobs' | 'hierarchies' | null

interface SyncButtonProps {
    variant?: 'default' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    className?: string
}

export function SyncButton({ variant = 'default', size = 'default', className }: SyncButtonProps) {
    const { fullFromApi, syncCompanies, syncUnits, syncSectors, syncJobs, processHierarchies, isLoading } =
        useSyncActions()
    const [pendingAction, setPendingAction] = useState<SyncAction>(null)

    function handleConfirm() {
        switch (pendingAction) {
            case 'full':
                fullFromApi()
                break
            case 'companies':
                syncCompanies([])
                break
            case 'units':
                syncUnits([])
                break
            case 'sectors':
                syncSectors([])
                break
            case 'jobs':
                syncJobs([])
                break
            case 'hierarchies':
                processHierarchies({})
                break
        }
        setPendingAction(null)
    }

    function handleCancel() {
        setPendingAction(null)
    }

    function handleFullSync() {
        setPendingAction('full')
    }

    function handleSyncCompanies() {
        setPendingAction('companies')
    }

    function handleSyncUnits() {
        setPendingAction('units')
    }

    function handleSyncSectors() {
        setPendingAction('sectors')
    }

    function handleSyncJobs() {
        setPendingAction('jobs')
    }

    function handleProcessHierarchies() {
        setPendingAction('hierarchies')
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={variant} size={size} className={className} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sincronizando...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Sincronizar
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Opções de Sincronização</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleFullSync}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sincronização Completa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSyncCompanies}>
                        <Building2 className="mr-2 h-4 w-4" />
                        Apenas Empresas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSyncUnits}>
                        <Network className="mr-2 h-4 w-4" />
                        Apenas Unidades
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSyncSectors}>
                        <GitBranch className="mr-2 h-4 w-4" />
                        Apenas Setores
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSyncJobs}>
                        <Users className="mr-2 h-4 w-4" />
                        Apenas Cargos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleProcessHierarchies}>
                        <Database className="mr-2 h-4 w-4" />
                        Apenas Hierarquias
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={pendingAction !== null} onOpenChange={open => !open && handleCancel()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingAction === 'full' && 'Confirmar Sincronização Completa'}
                            {pendingAction === 'companies' && 'Confirmar Sincronização de Empresas'}
                            {pendingAction === 'units' && 'Confirmar Sincronização de Unidades'}
                            {pendingAction === 'sectors' && 'Confirmar Sincronização de Setores'}
                            {pendingAction === 'jobs' && 'Confirmar Sincronização de Cargos'}
                            {pendingAction === 'hierarchies' && 'Confirmar Processamento de Hierarquias'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingAction === 'full' && (
                                <>
                                    Esta ação irá buscar todos os dados da API SOC e sincronizar no banco de dados
                                    local. Isso pode levar alguns minutos dependendo da quantidade de dados.
                                    <br />
                                    <br />A sincronização seguirá a ordem: Empresas → Unidades → Setores → Cargos →
                                    Hierarquias.
                                </>
                            )}
                            {pendingAction === 'companies' && (
                                <>
                                    Esta ação irá sincronizar apenas as empresas da API SOC no banco de dados local.
                                    <br />
                                    <br />
                                    As empresas são a base da hierarquia e devem ser sincronizadas primeiro.
                                </>
                            )}
                            {pendingAction === 'units' && (
                                <>
                                    Esta ação irá sincronizar apenas as unidades da API SOC no banco de dados local.
                                    <br />
                                    <br />
                                    <strong>Atenção:</strong> As empresas devem estar sincronizadas primeiro.
                                </>
                            )}
                            {pendingAction === 'sectors' && (
                                <>
                                    Esta ação irá sincronizar apenas os setores da API SOC no banco de dados local.
                                    <br />
                                    <br />
                                    <strong>Atenção:</strong> As unidades devem estar sincronizadas primeiro.
                                </>
                            )}
                            {pendingAction === 'jobs' && (
                                <>
                                    Esta ação irá sincronizar apenas os cargos da API SOC no banco de dados local.
                                    <br />
                                    <br />
                                    <strong>Atenção:</strong> Os setores devem estar sincronizados primeiro.
                                </>
                            )}
                            {pendingAction === 'hierarchies' && (
                                <>
                                    Esta ação irá processar as hierarquias e ajustar os relacionamentos entre empresas,
                                    unidades, setores e cargos.
                                    <br />
                                    <br />
                                    <strong>Atenção:</strong> Todos os dados devem estar sincronizados primeiro.
                                </>
                            )}
                            <br />
                            <br />
                            Deseja continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
