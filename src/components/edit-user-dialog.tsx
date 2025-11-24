import { InputMask } from '@/components/input-mask'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { userService } from '@/lib/services/user-service'
import { updateUserSchema, userRoles, type UpdateUserSchema, type UserSchema } from '@/lib/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditUserDialogProps {
    user: UserSchema | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
    const queryClient = useQueryClient()

    const form = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: '',
            email: '',
            cpf: '',
            phone: '',
            roles: ['USER'],
            active: true,
            passwordMustChange: false
        }
    })

    // Atualiza o formulário quando o usuário ou dialog muda
    useEffect(() => {
        if (user && open) {
            form.reset({
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                phone: user.phone || '',
                roles: user.roles,
                active: user.active,
                emailVerified: user.emailVerified,
                passwordMustChange: user.passwordMustChange
            })
        }
    }, [user, open, form])

    const updateUserMutation = useMutation({
        mutationFn: async (data: UpdateUserSchema) => {
            if (!user) throw new Error('Usuário não encontrado')

            // Atualiza os dados do usuário
            return await userService.update(user.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            onOpenChange(false)
            toast.success('Usuário atualizado com sucesso!')
        },
        onError: error => {
            toast.error('Erro ao atualizar usuário', {
                description: error.message
            })
        }
    })

    function onSubmit(values: UpdateUserSchema) {
        updateUserMutation.mutate(values)
    }

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                    <DialogDescription>Atualize os dados do usuário {user.name}.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="João da Silva" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="joao@exemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPF</FormLabel>
                                        <FormControl>
                                            <InputMask
                                                mask="999.999.999-99"
                                                value={field.value || ''}
                                                onChange={field.onChange}>
                                                {props => <Input placeholder="000.000.000-00" {...props} />}
                                            </InputMask>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone (opcional)</FormLabel>
                                        <FormControl>
                                            <InputMask
                                                mask="(99) 99999-9999"
                                                value={field.value || ''}
                                                onChange={field.onChange}>
                                                {props => <Input placeholder="(00) 00000-0000" {...props} />}
                                            </InputMask>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="roles"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Função</FormLabel>
                                        <Select
                                            value={field.value?.[0] || 'USER'}
                                            onValueChange={value => field.onChange([value])}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione uma função" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {userRoles.map(role => (
                                                    <SelectItem key={role} value={role}>
                                                        {role === 'ADMIN' && 'Administrador'}
                                                        {role === 'MANAGER' && 'Gerente'}
                                                        {role === 'USER' && 'Usuário'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="active"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Situação</FormLabel>
                                        <Select
                                            value={field.value ? 'true' : 'false'}
                                            onValueChange={value => field.onChange(value === 'true')}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Ativo</SelectItem>
                                                <SelectItem value="false">Inativo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={updateUserMutation.isPending}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={updateUserMutation.isPending}>
                                {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
