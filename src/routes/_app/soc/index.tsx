import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'

export const Route = createFileRoute('/_app/soc/')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="flex flex-col items-start justify-end">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">SOC</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Gerencie as operações do SOC</p>
            </div>

            <div className="mt-10 grid justify-center gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link
                    to="/soc/companies"
                    className={cn(
                        buttonVariants(),
                        'border-primary flex size-28 flex-col items-center justify-center gap-3 rounded-2xl border p-4 font-semibold'
                    )}>
                    <Building2 className="size-8" />
                    Empresas
                </Link>
            </div>
        </div>
    )
}
