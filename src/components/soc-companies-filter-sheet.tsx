'use client'

import { Filter, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useSocCompanyFiltersContext } from '@/providers/company-filters-provider'

interface CompaniesFilterSheetProps {
    className?: string
}

export function CompaniesFilterSheet({ className }: CompaniesFilterSheetProps) {
    const { tempFilters, setTempFilters, applyFilters, clearFilters } = useSocCompanyFiltersContext()
    const [open, setOpen] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        applyFilters()
        setOpen(false)
    }

    function handleReset() {
        clearFilters()
        setOpen(false)
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className={className}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filtrar empresas</SheetTitle>
                    <SheetDescription>Refine sua busca utilizando os filtros abaixo</SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                            <SelectTrigger id="status">
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
                            <SelectTrigger id="riskDegree">
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

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1">
                            Aplicar filtros
                        </Button>
                        <Button type="button" variant="outline" onClick={handleReset}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
