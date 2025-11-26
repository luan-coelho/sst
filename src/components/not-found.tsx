import { Button } from '@/components/ui/button'
import { useRouter } from '@tanstack/react-router'
import { ArrowLeft, Ghost, Home } from 'lucide-react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../components/ui/empty'

export default function NotFound() {
    const router = useRouter()

    const handleHomeClick = () => {
        router.navigate({ to: '/' })
    }

    const handleBackClick = () => {
        router.history.back()
    }

    return (
        <div className="bg-background px-6' relative flex min-h-screen w-full items-center justify-center overflow-hidden">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Ghost className="text-muted-foreground h-16 w-16" />
                    </EmptyMedia>
                    <EmptyTitle className="from-primary via-primary/80 bg-linear-to-r to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
                        404
                    </EmptyTitle>
                    <EmptyDescription className="text-lg">Página não encontrada</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button onClick={handleHomeClick} className="btn-default group">
                            <Home className="mr-1 h-4 w-4 transition-transform group-hover:scale-110" />
                            Ir para a página inicial
                        </Button>

                        <Button onClick={handleBackClick} variant="outline" className="group">
                            <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Voltar à página anterior
                        </Button>
                    </div>
                </EmptyContent>
            </Empty>
        </div>
    )
}
