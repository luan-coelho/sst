import { InputMask } from '@/components/input-mask'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { userService } from '@/lib/services/user-service'
import { createUserSchema, userRoles, type CreateUserSchema } from '@/lib/types/user'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type CreateUserDialogProps = {
    className?: string
}

export function CreateUserDialog({ className }: CreateUserDialogProps) {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: '',
            email: '',
            cpf: '',
            phone: '',
            roles: ['USER'],
            active: true,
            emailVerified: false,
            passwordMustChange: false
        } as CreateUserSchema
    })

    const createUserMutation = useMutation({
        mutationFn: (data: CreateUserSchema) => userService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setOpen(false)
            form.reset()
            toast.success('Usuário criado com sucesso!')
        },
        onError: error => {
            toast.error('Erro ao criar usuário', {
                description: error.message
            })
        }
    })

    function onSubmit(values: CreateUserSchema) {
        createUserMutation.mutate(values)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={cn(className)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Usuário
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                    <DialogDescription>Preencha os dados para criar um novo usuário no sistema.</DialogDescription>
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
                                                value={field.value}
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

                        <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Função</FormLabel>
                                    <Select value={field.value?.[0]} onValueChange={value => field.onChange([value])}>
                                        <FormControl>
                                            <SelectTrigger>
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
                                    <FormDescription>Define as permissões do usuário no sistema</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={createUserMutation.isPending}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createUserMutation.isPending}>
                                {createUserMutation.isPending ? 'Criando...' : 'Criar Usuário'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
