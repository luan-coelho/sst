import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { UserSchema } from '@/lib/types/user'
import { userService } from '@/lib/services/user-service'

export function useUserActions() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => userService.delete(userId),
        onSuccess: () => {
            toast.success('Usuário excluído com sucesso')
            queryClient.invalidateQueries({ queryKey: ['users'] })
            router.navigate({ to: '/users' })
        },
        onError: (error: Error) => {
            toast.error('Erro ao excluir usuário', {
                description: error.message
            })
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<UserSchema> }) => userService.update(id, data),
        onSuccess: updatedUser => {
            toast.success('Usuário atualizado com sucesso')
            queryClient.invalidateQueries({ queryKey: ['user', updatedUser.id] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error: Error) => {
            toast.error('Erro ao atualizar usuário', {
                description: error.message
            })
        }
    })

    function handleDelete(userId: string) {
        deleteMutation.mutate(userId)
    }

    function handleUpdate(userId: string, data: Partial<UserSchema>) {
        updateMutation.mutate({ id: userId, data })
    }

    return {
        handleDelete,
        handleUpdate,
        isDeleting: deleteMutation.isPending,
        isUpdating: updateMutation.isPending
    }
}
