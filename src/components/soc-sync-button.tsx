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
import { useSyncActions } from '@/hooks/use-sync-actions'
import { Loader2, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function SyncButton() {
    const { fullFromApi, isLoading } = useSyncActions()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    function handleConfirm() {
        fullFromApi()
        setIsConfirmOpen(false)
    }

    return (
        <>
            <Button variant="outline" disabled={isLoading} onClick={() => setIsConfirmOpen(true)}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sincronizando...
                    </>
                ) : (
                    <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sincronizar
                    </>
                )}
            </Button>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Sincronização Completa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação irá buscar todos os dados da API SOC e sincronizar no banco de dados local. Isso
                            pode levar alguns minutos dependendo da quantidade de dados. Deseja continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
