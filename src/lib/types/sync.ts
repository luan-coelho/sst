export type SyncStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'ERROR'

export interface SyncResponse {
    message: string
    status: SyncStatus
    companies?: number
    units?: number
    sectors?: number
    jobs?: number
    hierarchyCompanies?: number
    error?: string
}

export interface SocCompanyApiData {
    CODIGO: string
    NOMEABREVIADO: string
    RAZAOSOCIAL: string
    CNPJ: string
    ENDERECO: string
    NUMEROENDERECO: string
    BAIRRO: string
    CIDADE: string
    UF: string
    CEP: string
    ATIVO: string
}

export interface SocUnitApiData {
    CODIGO: string
    CODIGOEMPRESA: string
    NOMEUNIDADE: string
    RAZAOSOCIAL: string
    CNPJ: string
    CPF: string
    CAEPF: string
    ENDERECO: string
    NUMEROENDERECO: string
    BAIRRO: string
    CIDADE: string
    UF: string
    CEP: string
    CNAE: string
    GRAURISCO: string
    ATIVO: string
}

export interface SocSectorApiData {
    CODIGO: string
    CODIGOEMPRESA: string
    NOMESETOR: string
    ATIVO: string
}

export interface SocJobApiData {
    CODIGO: string
    CODIGOEMPRESA: string
    NOMECARGO: string
    DESCRICAODETALHADAPPRAPCMSO: string
    ATIVO: string
}

export interface SocHierarchyApiData {
    NOMEUNIDADE: string
    NOMESETOR: string
    NOMECARGO: string
    DESCRICAODETALHADAPPRAPCMSO: string
}

export type HierarchyByCompanyCode = Record<string, Array<SocHierarchyApiData>>
