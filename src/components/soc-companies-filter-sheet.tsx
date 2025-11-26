'use client'

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
import { useSocCompanyFiltersContext } from '@/providers/company-filters-provider'
import { Filter, X } from 'lucide-react'

interface CompaniesFilterSheetProps {
    className?: string
}

export function CompaniesFilterSheet({ className }: CompaniesFilterSheetProps) {
    const { tempFilters, setTempFilters, applyFilters, clearFilters } = useSocCompanyFiltersContext()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className={className}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                </Button>
            </SheetTrigger>
            <SheetContent className="p-5">
                <SheetHeader className="p-0">
                    <SheetTitle>Filtrar empresas</SheetTitle>
                    <SheetDescription>Refine sua busca utilizando os filtros abaixo</SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="search">Buscar</Label>
                        <Input
                            id="search"
                            placeholder="Nome, razão social ou CNPJ..."
                            value={tempFilters.search}
                            onChange={e => setTempFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Situação</Label>
                        <Select
                            value={tempFilters.status}
                            onValueChange={(value: 'all' | 'active' | 'inactive') =>
                                setTempFilters(prev => ({ ...prev, status: value }))
                            }>
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="active">Ativas</SelectItem>
                                <SelectItem value="inactive">Inativas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="riskDegree">Grau de Risco</Label>
                        <Select
                            value={tempFilters.riskDegree}
                            onValueChange={(value: 'all' | '1' | '2' | '3' | '4') =>
                                setTempFilters(prev => ({ ...prev, riskDegree: value }))
                            }>
                            <SelectTrigger id="riskDegree" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="1">Grau 1</SelectItem>
                                <SelectItem value="2">Grau 2</SelectItem>
                                <SelectItem value="3">Grau 3</SelectItem>
                                <SelectItem value="4">Grau 4</SelectItem>
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
