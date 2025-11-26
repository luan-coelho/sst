import { ErrorState } from '@/components/error-state'
import { Badge } from '@/components/ui/badge'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { socCompanyService } from '@/lib/services/company-service'
import type { SocCompany, SocUnit } from '@/lib/types/soc'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    MapPin,
    Users,
    XCircle
} from 'lucide-react'

export const Route = createFileRoute('/_app/soc/companies/$companyId')({
    head: () => ({
        meta: [
            {
                title: 'Empresa'
            }
        ]
    }),
    component: CompanyPage
})

function CompanyPage() {
    const { companyId } = Route.useParams()

    const {
        data: company,
        isLoading,
        error
    } = useQuery({
        queryKey: ['soc-company', companyId],
        queryFn: () => socCompanyService.getById<SocCompany>(companyId),
        enabled: !!companyId
    })

    if (isLoading) {
        return <CompanyViewSkeleton />
    }

    if (error || !company) {
        return (
            <div className="container mx-auto max-w-7xl p-6">
                <ErrorState
                    title="Erro ao carregar empresa"
                    message={(error as Error)?.message || 'Empresa não encontrada'}
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-7xl space-y-6 p-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/soc/companies">Empresas</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{company.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/soc/companies">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
                        <p className="text-muted-foreground">{company.companyName}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Sidebar com informações principais */}
                <div className="space-y-6">
                    {/* Card de Perfil */}
                    <Card>
                        <CardHeader className="text-center">
                            <div className="bg-primary/10 mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full">
                                <Building2 className="text-primary h-16 w-16" />
                            </div>
                            <CardTitle className="text-2xl">{company.name}</CardTitle>
                            <CardDescription className="text-base">{company.companyName}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-center gap-2">
                                {company.active ? (
                                    <Badge variant="default" className="gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Ativa
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="gap-1">
                                        <XCircle className="h-3 w-3" />
                                        Inativa
                                    </Badge>
                                )}
                                <Badge variant={getRiskDegreeBadgeVariant(company.riskDegree)}>
                                    {getRiskDegreeLabel(company.riskDegree)}
                                </Badge>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Código SOC</span>
                                    <span className="font-mono font-medium">{company.socCode}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">CNPJ</span>
                                    <span className="font-mono font-medium">{company.cnpj}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">CNAE</span>
                                    <span className="font-mono font-medium">{company.cnae}</span>
                                </div>
                                {company.caepf && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">CAEPF</span>
                                        <span className="font-mono font-medium">{company.caepf}</span>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="bg-muted flex items-center justify-center gap-2 rounded-lg p-3">
                                <Users className="text-muted-foreground h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {company?.units?.length} {company?.units?.length === 1 ? 'unidade' : 'unidades'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Conteúdo principal */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Detalhes</TabsTrigger>
                            <TabsTrigger value="units">
                                Unidades {company?.units?.length > 0 && `(${company?.units?.length})`}
                            </TabsTrigger>
                            <TabsTrigger value="history">Histórico</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações Gerais</CardTitle>
                                    <CardDescription>Dados cadastrais da empresa</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Building2 className="text-muted-foreground h-4 w-4" />
                                                Nome Fantasia
                                            </div>
                                            <p className="text-muted-foreground text-sm">{company.name}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileText className="text-muted-foreground h-4 w-4" />
                                                Razão Social
                                            </div>
                                            <p className="text-muted-foreground text-sm">{company.companyName}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileText className="text-muted-foreground h-4 w-4" />
                                                CNPJ
                                            </div>
                                            <p className="text-muted-foreground font-mono text-sm">{company.cnpj}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileText className="text-muted-foreground h-4 w-4" />
                                                CNAE
                                            </div>
                                            <p className="text-muted-foreground font-mono text-sm">{company.cnae}</p>
                                        </div>

                                        {company.caepf && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <FileText className="text-muted-foreground h-4 w-4" />
                                                    CAEPF
                                                </div>
                                                <p className="text-muted-foreground font-mono text-sm">
                                                    {company.caepf}
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileText className="text-muted-foreground h-4 w-4" />
                                                Código SOC
                                            </div>
                                            <p className="text-muted-foreground font-mono text-sm">{company.socCode}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Endereço</CardTitle>
                                    <CardDescription>Localização da empresa</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                                        <p className="text-muted-foreground text-sm">{company.address}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Datas Importantes</CardTitle>
                                    <CardDescription>Histórico de eventos do cadastro</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Calendar className="text-muted-foreground h-4 w-4" />
                                                Data de Criação
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                {formatDate(company.createdAt)}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Clock className="text-muted-foreground h-4 w-4" />
                                                Última Atualização
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                {formatDate(company.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="units" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Unidades da Empresa</CardTitle>
                                    <CardDescription>
                                        {company?.units?.length === 0
                                            ? 'Nenhuma unidade cadastrada'
                                            : `${company?.units?.length} ${company?.units?.length === 1 ? 'unidade cadastrada' : 'unidades cadastradas'}`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <UnitsTable units={company?.units} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Histórico de Alterações</CardTitle>
                                    <CardDescription>Registro de mudanças da empresa</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <Clock className="text-muted-foreground/50 mx-auto h-12 w-12" />
                                            <p className="text-muted-foreground mt-4 text-sm">
                                                Nenhum histórico disponível
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

function CompanyViewSkeleton() {
    return (
        <div className="container mx-auto max-w-7xl space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-96" />
                <Skeleton className="col-span-2 h-96" />
            </div>
        </div>
    )
}

function formatDate(dateString?: string) {
    if (!dateString) return 'N/A'
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'long',
        timeStyle: 'short'
    }).format(new Date(dateString))
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

function UnitsTable({ units }: { units: Array<SocUnit> }) {
    if (!units.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Building2 className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-sm">Nenhuma unidade cadastrada</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Código SOC</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>CNPJ/CPF</TableHead>
                        <TableHead>CNAE</TableHead>
                        <TableHead>Grau de Risco</TableHead>
                        <TableHead>Situação</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {units.map(unit => (
                        <TableRow key={unit.id} className="group">
                            <TableCell className="font-mono text-sm font-medium">{unit.socCode}</TableCell>
                            <TableCell className="font-medium">{unit.name}</TableCell>
                            <TableCell className="font-mono text-sm">{unit.cnpj || unit.cpf}</TableCell>
                            <TableCell className="font-mono text-sm">{unit.cnae}</TableCell>
                            <TableCell>
                                <Badge variant={getRiskDegreeBadgeVariant(unit.riskDegree)}>
                                    {getRiskDegreeLabel(unit.riskDegree)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={unit.active ? 'default' : 'secondary'}>
                                    {unit.active ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/soc/companies/$companyId" params={{ companyId: unit.id }}>
                                        Ver detalhes
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
