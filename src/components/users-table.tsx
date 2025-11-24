'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { UserSchema } from '@/lib/types/user'
import { useUserFiltersContext } from '@/providers/user-filters-provider'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { EditUserDialog } from './edit-user-dialog'

interface UsersTableProps {
    users: Array<UserSchema>
    isLoading?: boolean
    pagination?: {
        page: number
        pageSize: number
        totalPages: number
        totalElements: number
    }
    onEdit?: (user: UserSchema) => void
    onDelete?: (user: UserSchema) => void
}

export function UsersTable({ users, isLoading, pagination, onEdit }: UsersTableProps) {
    const { changePage } = useUserFiltersContext()
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserSchema | null>(null)

    function handleEdit(user: UserSchema) {
        setSelectedUser(user)
        setEditDialogOpen(true)
        onEdit?.(user)
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        )
    }

    if (!users.length) {
        return (
            <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground text-sm">Nenhum usuário encontrado</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Funções</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: UserSchema) => (
                            <TableRow key={user.id} className="group">
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                                <TableCell className="font-mono text-sm">{user.cpf}</TableCell>
                                <TableCell className="text-sm">{user.phone || '-'}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles.map((role: string) => (
                                            <Badge key={role} variant="outline" className="text-xs">
                                                {role === 'ADMIN' && 'Administrador'}
                                                {role === 'MANAGER' && 'Gerente'}
                                                {role === 'USER' && 'Usuário'}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.active ? 'default' : 'secondary'}>
                                        {user.active ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    tabIndex={0}
                                                    aria-label="Abrir menu">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        to={`/users/$userId`}
                                                        params={{ userId: user.id }}
                                                        tabIndex={0}
                                                        aria-label="Ver detalhes do usuário">
                                                        Ver detalhes
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleEdit(user)}
                                                    tabIndex={0}
                                                    aria-label="Editar usuário">
                                                    Editar usuário
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">
                        Mostrando {pagination.page * pagination.pageSize + 1} até{' '}
                        {Math.min((pagination.page + 1) * pagination.pageSize, pagination.totalElements)} de{' '}
                        {pagination.totalElements} resultados
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => changePage(pagination.page - 1)}
                            disabled={pagination.page === 0}>
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Anterior
                        </Button>
                        <div className="flex items-center gap-1">
                            <span className="text-sm">
                                Página {pagination.page + 1} de {pagination.totalPages}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => changePage(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages - 1}>
                            Próxima
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            <EditUserDialog
                user={selectedUser}
                open={editDialogOpen}
                onOpenChange={open => {
                    setEditDialogOpen(open)
                    if (!open) setSelectedUser(null)
                }}
            />
        </div>
    )
}
