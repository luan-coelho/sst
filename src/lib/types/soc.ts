// Empresa
export interface SocCompany {
    id: string
    socCode: string
    name: string
    companyName: string
    cnpj: string
    caepf: string
    address: string
    cnae: string
    riskDegree: string
    active: boolean
    createdAt: string
    updatedAt: string
    units: Array<SocUnit>
}

// Unidade
export interface SocUnit {
    id: string
    socCode: string
    socCompanyCode: string
    name: string
    companyName: string
    cnpj: string
    cpf: string
    caepf: string
    address: string
    cnae: string
    riskDegree: string
    active: boolean
    createdAt: string
    updatedAt: string
    sectors: Array<SocSector>
}

// Setor
export interface SocSector {
    id: string
    socCode: string
    socCompanyCode: string
    name: string
    active: boolean
    createdAt: string
    updatedAt: string
    jobs: Array<SocJob>
}

// Cargo
export interface SocJob {
    id: string
    socCode: string
    socCompanyCode: string
    name: string
    detailedDescription: string
    active: boolean
    createdAt: string
    updatedAt: string
}
