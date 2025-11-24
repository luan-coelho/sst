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
import { routes } from '@/lib/routes'
import type { SocCompany } from '@/lib/types/soc'
import { useSocCompanyFiltersContext } from '@/providers/company-filters-provider'
import { Building2, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

interface SocCompaniesTableProps {
    companies: Array<SocCompany>
    isLoading?: boolean
    pagination?: {
        page: number
        pageSize: number
        totalPages: number
        totalElements: number
    }
}

function getRiskDegreeBadgeVariant(degree: string) {
    const degreeNumber = parseInt(degree)
    if (degreeNumber === 1) return 'default'
    if (degreeNumber === 2) return 'secondary'
    if (degreeNumber === 3) return 'outline'
    return 'destructive'
}

function getRiskDegreeLabel(degree: string) {
    return `Grau ${degree}`
}

export function SocCompaniesTable({ companies, isLoading, pagination }: SocCompaniesTableProps) {
    const { changePage } = useSocCompanyFiltersContext()

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        )
    }

    if (!companies.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Building2 className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-sm">Nenhuma empresa encontrada</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código SOC</TableHead>
                            <TableHead>Nome Fantasia</TableHead>
                            <TableHead>Razão Social</TableHead>
                            <TableHead>CNPJ</TableHead>
                            <TableHead>CNAE</TableHead>
                            <TableHead>Grau de Risco</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companies.map((company: SocCompany) => (
                            <TableRow key={company.id} className="group">
                                <TableCell className="font-mono text-sm font-medium">{company.socCode}</TableCell>
                                <TableCell className="font-medium">{company.name}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">{company.companyName}</TableCell>
                                <TableCell className="font-mono text-sm">{company.cnpj}</TableCell>
                                <TableCell className="font-mono text-sm">{company.cnae}</TableCell>
                                <TableCell>
                                    <Badge variant={getRiskDegreeBadgeVariant(company.riskDegree)}>
                                        {getRiskDegreeLabel(company.riskDegree)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={company.active ? 'default' : 'secondary'}>
                                        {company.active ? 'Ativa' : 'Inativa'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
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
                                                    href={routes.app.soc.companies.detail(company.id)}
                                                    tabIndex={0}
                                                    aria-label="Ver detalhes da empresa">
                                                    Ver detalhes
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => navigator.clipboard.writeText(company.cnpj)}
                                                tabIndex={0}
                                                aria-label="Copiar CNPJ">
                                                Copiar CNPJ
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
        </div>
    )
}
