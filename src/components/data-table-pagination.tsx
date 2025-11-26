import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination'

interface DataTablePaginationProps {
    page: number
    pageSize: number
    totalPages: number
    totalElements: number
    onPageChange: (page: number) => void
}

export function DataTablePagination({
    page,
    pageSize,
    totalPages,
    totalElements,
    onPageChange
}: DataTablePaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
                Mostrando {page * pageSize + 1} até {Math.min((page + 1) * pageSize, totalElements)} de {totalElements}{' '}
                resultados
            </div>
            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                if (page > 0) onPageChange(page - 1)
                            }}
                            aria-disabled={page === 0}
                            className={page === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>

                    {(() => {
                        const items = []
                        const startPage = 0
                        const endPage = totalPages - 1
                        const currentPage = page

                        if (totalPages <= 7) {
                            for (let i = 0; i < totalPages; i++) {
                                items.push(i)
                            }
                        } else {
                            items.push(startPage)

                            if (currentPage > 2) {
                                items.push('ellipsis-start')
                            }

                            const start = Math.max(1, currentPage - 1)
                            const end = Math.min(endPage - 1, currentPage + 1)

                            for (let i = start; i <= end; i++) {
                                items.push(i)
                            }

                            if (currentPage < endPage - 2) {
                                items.push('ellipsis-end')
                            }

                            items.push(endPage)
                        }

                        return items.map((item, index) => {
                            if (typeof item === 'string') {
                                return (
                                    <PaginationItem key={`${item}-${index}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )
                            }
                            return (
                                <PaginationItem key={item}>
                                    <PaginationLink
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault()
                                            onPageChange(item)
                                        }}
                                        isActive={page === item}>
                                        {item + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })
                    })()}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                if (page < totalPages - 1) onPageChange(page + 1)
                            }}
                            aria-disabled={page >= totalPages - 1}
                            className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
