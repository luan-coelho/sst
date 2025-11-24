export interface SocCompanyFilterState {
    search: string
    status: 'all' | 'active' | 'inactive'
    riskDegree: 'all' | '1' | '2' | '3' | '4'
}
