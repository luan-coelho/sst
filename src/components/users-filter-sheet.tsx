'use client'

import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useUserFiltersContext } from '@/providers/user-filters-provider'

type UsersFilterSheetProps = {
    className?: string
}

export function UsersFilterSheet({ className }: UsersFilterSheetProps) {
    const { tempFilters, setTempFilters, applyFilters, clearFilters } = useUserFiltersContext()

    function handleSearchChange(value: string) {
        setTempFilters(prev => ({ ...prev, search: value }))
    }

    function handleRoleChange(value: string) {
        setTempFilters(prev => ({ ...prev, role: value }))
    }

    function handleStatusChange(value: string) {
        setTempFilters(prev => ({ ...prev, status: value }))
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className={cn(className)}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                </Button>
            </SheetTrigger>
            <SheetContent className="p-5">
                <SheetHeader className="p-0">
                    <SheetTitle>Filtros</SheetTitle>
                    <SheetDescription>Configure os filtros para a listagem de usuários</SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="search">Buscar</Label>
                        <Input
                            id="search"
                            placeholder="Nome, email ou CPF..."
                            value={tempFilters.search}
                            onChange={e => handleSearchChange(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Função</Label>
                        <Select value={tempFilters.role} onValueChange={handleRoleChange}>
                            <SelectTrigger id="role" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="ADMIN">Administrador</SelectItem>
                                <SelectItem value="USER">Usuário</SelectItem>
                                <SelectItem value="MANAGER">Gerente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Situação</Label>
                        <Select value={tempFilters.status} onValueChange={handleStatusChange}>
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Ativos</SelectItem>
                                <SelectItem value="inactive">Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <SheetFooter className="gap-2">
                    <Button variant="outline" onClick={clearFilters} className="flex-1">
                        <X className="mr-2 h-4 w-4" />
                        Limpar
                    </Button>
                    <SheetClose asChild>
                        <Button onClick={applyFilters} className="flex-1">
                            <Filter className="mr-2 h-4 w-4" />
                            Aplicar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
