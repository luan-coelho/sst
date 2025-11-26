import {
    buildQuery,
    eq,
    gt,
    gte,
    inArray,
    like,
    lt,
    lte,
    neq,
    QueryBuilder,
    sortAsc,
    sortDesc
} from '@/lib/query-builder'
import { describe, expect, it } from 'vitest'

describe('QueryBuilder', () => {
    describe('Paginação', () => {
        it('deve adicionar paginação básica', () => {
            const builder = new QueryBuilder()
            const query = builder.addPagination(0, 20).toString()
            expect(query).toBe('?page=0&size=20')
        })

        it('deve ignorar paginação quando não fornecida', () => {
            const builder = new QueryBuilder()
            const query = builder.addPagination().toString()
            expect(query).toBe('')
        })

        it('deve aceitar page 0', () => {
            const builder = new QueryBuilder()
            const query = builder.addPagination(0).toString()
            expect(query).toBe('?page=0')
        })
    })

    describe('Busca Textual', () => {
        it('deve adicionar busca textual', () => {
            const builder = new QueryBuilder()
            const query = builder.addSearch('joão').toString()
            expect(query).toBe('?q=jo%C3%A3o')
        })

        it('deve ignorar busca vazia', () => {
            const builder = new QueryBuilder()
            const query = builder.addSearch('').toString()
            expect(query).toBe('')
        })

        it('deve fazer trim da busca', () => {
            const builder = new QueryBuilder()
            const query = builder.addSearch('  joão  ').toString()
            expect(query).toBe('?q=jo%C3%A3o')
        })
    })

    describe('Ordenação', () => {
        it('deve adicionar ordenação simples', () => {
            const builder = new QueryBuilder()
            const query = builder.addSort('name').toString()
            expect(query).toBe('?sort=name')
        })

        it('deve adicionar ordenação decrescente', () => {
            const builder = new QueryBuilder()
            const query = builder.addSort('-createdAt').toString()
            expect(query).toBe('?sort=-createdAt')
        })

        it('deve adicionar múltiplas ordenações', () => {
            const builder = new QueryBuilder()
            const query = builder.addSort(['name', '-createdAt']).toString()
            expect(query).toBe('?sort=name%2C-createdAt')
        })

        it('deve usar SortConfig objects', () => {
            const builder = new QueryBuilder()
            const query = builder.addSort([sortAsc('name'), sortDesc('createdAt')]).toString()
            expect(query).toBe('?sort=name%2C-createdAt')
        })
    })

    describe('Filtros Simples', () => {
        it('deve adicionar filtro de igualdade', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ active: true }).toString()
            expect(query).toBe('?active=true')
        })

        it('deve adicionar múltiplos filtros', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ active: true, verified: false }).toString()
            expect(query).toContain('active=true')
            expect(query).toContain('verified=false')
        })

        it('deve lidar com valores numéricos', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ age: 25 }).toString()
            expect(query).toBe('?age=25')
        })

        it('deve lidar com strings', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ name: 'João' }).toString()
            expect(query).toBe('?name=Jo%C3%A3o')
        })
    })

    describe('Filtros com Operadores', () => {
        it('deve adicionar filtro LIKE', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ name: like('joão') }).toString()
            expect(query).toBe('?name%5Blike%5D=jo%C3%A3o')
        })

        it('deve adicionar filtro GTE', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ age: gte(18) }).toString()
            expect(query).toBe('?age%5Bgte%5D=18')
        })

        it('deve adicionar filtro LTE', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ age: lte(30) }).toString()
            expect(query).toBe('?age%5Blte%5D=30')
        })

        it('deve adicionar filtro GT', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ price: gt(100) }).toString()
            expect(query).toBe('?price%5Bgt%5D=100')
        })

        it('deve adicionar filtro LT', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ price: lt(1000) }).toString()
            expect(query).toBe('?price%5Blt%5D=1000')
        })

        it('deve adicionar filtro NEQ', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ status: neq('deleted') }).toString()
            expect(query).toBe('?status%5Bneq%5D=deleted')
        })

        it('deve adicionar filtro EQ explícito', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ status: eq('active') }).toString()
            expect(query).toBe('?status%5Beq%5D=active')
        })

        it('deve adicionar filtro IN', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ id: inArray(['uuid1', 'uuid2', 'uuid3']) }).toString()
            expect(query).toBe('?id%5Bin%5D=uuid1%2Cuuid2%2Cuuid3')
        })
    })

    describe('Arrays (OR Lógico)', () => {
        it('deve adicionar múltiplos valores para o mesmo campo (repeat)', () => {
            const builder = new QueryBuilder({ arrayFormat: 'repeat' })
            const query = builder.addFilters({ status: ['active', 'pending'] }).toString()
            expect(query).toContain('status=active')
            expect(query).toContain('status=pending')
        })

        it('deve adicionar valores booleanos múltiplos', () => {
            const builder = new QueryBuilder()
            const query = builder.addFilters({ active: [true, false] }).toString()
            expect(query).toContain('active=true')
            expect(query).toContain('active=false')
        })
    })

    describe('buildQuery Helper', () => {
        it('deve construir query completa', () => {
            const query = buildQuery({
                page: 0,
                size: 20,
                q: 'joão',
                sort: '-createdAt',
                filters: {
                    active: true,
                    name: like('silva')
                }
            })

            expect(query).toContain('page=0')
            expect(query).toContain('size=20')
            expect(query).toContain('q=jo%C3%A3o')
            expect(query).toContain('sort=-createdAt')
            expect(query).toContain('active=true')
            expect(query).toContain('name%5Blike%5D=silva')
        })

        it('deve ignorar valores undefined', () => {
            const query = buildQuery({
                page: 0,
                size: undefined,
                filters: {
                    name: undefined,
                    active: true
                }
            })

            expect(query).toContain('page=0')
            expect(query).not.toContain('size')
            expect(query).not.toContain('name')
            expect(query).toContain('active=true')
        })

        it('deve ignorar strings vazias', () => {
            const query = buildQuery({
                q: '',
                filters: {
                    name: ''
                }
            })

            expect(query).toBe('')
        })
    })

    describe('Casos Complexos', () => {
        it('deve combinar todos os tipos de filtros', () => {
            const query = buildQuery({
                page: 1,
                size: 20,
                q: 'busca',
                sort: ['name', '-createdAt'],
                filters: {
                    active: true,
                    name: like('joão'),
                    age: gte(18),
                    status: ['active', 'pending'],
                    roles: inArray(['ADMIN', 'USER'])
                }
            })

            expect(query).toContain('page=1')
            expect(query).toContain('size=20')
            expect(query).toContain('q=busca')
            expect(query).toContain('sort=name%2C-createdAt')
            expect(query).toContain('active=true')
            expect(query).toContain('name%5Blike%5D=jo%C3%A3o')
            expect(query).toContain('age%5Bgte%5D=18')
            expect(query).toContain('status=active')
            expect(query).toContain('status=pending')
            expect(query).toContain('roles%5Bin%5D=ADMIN%2CUSER')
        })

        it('deve lidar com campos aninhados', () => {
            const query = buildQuery({
                filters: {
                    'endereco.estado.sigla': 'TO',
                    'endereco.cidade': like('Palmas')
                }
            })

            expect(query).toContain('endereco.estado.sigla=TO')
            expect(query).toContain('endereco.cidade%5Blike%5D=Palmas')
        })

        it('deve lidar com datas', () => {
            const query = buildQuery({
                filters: {
                    createdAt: gte('2025-01-01'),
                    'createdAt[lte]': '2025-01-31'
                }
            })

            expect(query).toContain('createdAt%5Bgte%5D=2025-01-01')
            expect(query).toContain('createdAt%5Blte%5D=2025-01-31')
        })
    })

    describe('Opções de Configuração', () => {
        it('deve não pular null quando skipNull=false', () => {
            const builder = new QueryBuilder({ skipNull: false })
            const query = builder.addFilters({ name: null as unknown as string }).toString()
            expect(query).toBe('?name=null')
        })

        it('deve não pular string vazia quando skipEmptyString=false', () => {
            const builder = new QueryBuilder({ skipEmptyString: false })
            const query = builder.addFilters({ name: '' }).toString()
            expect(query).toBe('?name=')
        })
    })

    describe('Helpers de Ordenação', () => {
        it('sortAsc deve criar config crescente', () => {
            const config = sortAsc('name')
            expect(config).toEqual({ field: 'name', direction: 'asc' })
        })

        it('sortDesc deve criar config decrescente', () => {
            const config = sortDesc('createdAt')
            expect(config).toEqual({ field: 'createdAt', direction: 'desc' })
        })
    })
})
