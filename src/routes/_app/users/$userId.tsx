import { AvatarFallback } from '@radix-ui/react-avatar'
import { Separator } from '@radix-ui/react-select'
import { TabsContent } from '@radix-ui/react-tabs'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Calendar, CheckCircle2, Clock, Edit, Mail, Phone, Shield, User, XCircle } from 'lucide-react'
import { useState } from 'react'
import type { RoleSchema } from '@/lib/types/user'
import { EditUserDialog } from '@/components/edit-user-dialog'
import { ErrorState } from '@/components/error-state'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { userService } from '@/lib/services/user-service'

export const Route = createFileRoute('/_app/users/$userId')({
    component: RouteComponent
})

function RouteComponent() {
    const { userId } = Route.useParams()
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const {
        data: user,
        isLoading,
        error
    } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => userService.findById(userId),
        enabled: !!userId
    })

    if (isLoading) {
        return <UserViewSkeleton />
    }

    if (error || !user) {
        return (
            <div className="container mx-auto max-w-6xl p-6">
                <ErrorState
                    title="Erro ao carregar usuário"
                    message={(error as Error)?.message || 'Usuário não encontrado'}
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-6xl space-y-6 p-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/users">Usuários</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{user.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/users">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                        <p className="text-muted-foreground">Detalhes do usuário</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Sidebar com informações principais */}
                <div className="space-y-6">
                    {/* Card de Perfil */}
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage src={undefined} alt={user.name} />
                                    <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <CardDescription className="text-base">{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-center gap-2">
                                {user.active ? (
                                    <Badge variant="default" className="gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Ativo
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="gap-1">
                                        <XCircle className="h-3 w-3" />
                                        Inativo
                                    </Badge>
                                )}
                                {user.emailVerified && (
                                    <Badge variant="secondary" className="gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        E-mail verificado
                                    </Badge>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield className="text-muted-foreground h-4 w-4" />
                                    <span className="font-medium">Funções:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {user.roles.map(role => (
                                        <Badge
                                            key={role}
                                            variant={roleColors[role] as 'destructive' | 'default' | 'secondary'}>
                                            {roleLabels[role]}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Conteúdo principal */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Detalhes</TabsTrigger>
                            <TabsTrigger value="activity">Atividade</TabsTrigger>
                            <TabsTrigger value="security">Segurança</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações de Contato</CardTitle>
                                    <CardDescription>Dados para comunicação com o usuário</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Mail className="text-muted-foreground h-4 w-4" />
                                                E-mail
                                            </div>
                                            <p className="text-muted-foreground text-sm">{user.email}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Phone className="text-muted-foreground h-4 w-4" />
                                                Telefone
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                {user.phone || 'Não informado'}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <User className="text-muted-foreground h-4 w-4" />
                                                CPF
                                            </div>
                                            <p className="text-muted-foreground text-sm">{user.cpf}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Shield className="text-muted-foreground h-4 w-4" />
                                                ID do Usuário
                                            </div>
                                            <p className="text-muted-foreground font-mono text-sm">{user.id}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Datas Importantes</CardTitle>
                                    <CardDescription>Histórico de eventos da conta</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Calendar className="text-muted-foreground h-4 w-4" />
                                                Data de Criação
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                {formatDate(user.createdAt)}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Clock className="text-muted-foreground h-4 w-4" />
                                                Última Atualização
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                {formatDate(user.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Atividades Recentes</CardTitle>
                                    <CardDescription>Histórico de ações do usuário</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <Clock className="text-muted-foreground/50 mx-auto h-12 w-12" />
                                            <p className="text-muted-foreground mt-4 text-sm">
                                                Nenhuma atividade recente registrada
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configurações de Segurança</CardTitle>
                                    <CardDescription>Gerencie as configurações de segurança da conta</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Verificação de E-mail</p>
                                                <p className="text-muted-foreground text-sm">
                                                    {user.emailVerified
                                                        ? 'O e-mail deste usuário foi verificado'
                                                        : 'O e-mail ainda não foi verificado'}
                                                </p>
                                            </div>
                                            {user.emailVerified ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircle className="text-destructive h-5 w-5" />
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Alteração de Senha Obrigatória</p>
                                                <p className="text-muted-foreground text-sm">
                                                    {user.passwordMustChange
                                                        ? 'Usuário deve alterar a senha no próximo login'
                                                        : 'Não é necessário alterar a senha'}
                                                </p>
                                            </div>
                                            {user.passwordMustChange ? (
                                                <XCircle className="text-destructive h-5 w-5" />
                                            ) : (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Dialog de Edição */}
            <EditUserDialog user={user} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
        </div>
    )
}

const roleColors: Record<RoleSchema, string> = {
    ADMIN: 'destructive',
    MANAGER: 'default',
    USER: 'secondary'
}

const roleLabels: Record<RoleSchema, string> = {
    ADMIN: 'Administrador',
    MANAGER: 'Gerente',
    USER: 'Usuário'
}

function UserViewSkeleton() {
    return (
        <div className="container mx-auto max-w-6xl space-y-6 p-6">
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

function getInitials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
