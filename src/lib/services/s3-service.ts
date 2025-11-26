import { authClient } from '@/lib/auth-client'
import { HttpClient } from '@/lib/http-client'
import type {
    CopyMoveResponse,
    ListObjectsParams,
    ListObjectsResponse,
    ObjectExistsResponse,
    ObjectMetadata,
    PresignedUrlDownloadRequest,
    PresignedUrlResponse,
    PresignedUrlUploadRequest,
    UploadFileRequest,
    UploadFileResponse
} from '@/lib/types/s3'
import { BaseService } from './base-service'

/**
 * Service para comunicação com a API S3
 */
export class S3Service extends BaseService {
    constructor() {
        super('/api/s3')
    }

    /**
     * Faz upload de um arquivo para o S3
     */
    async uploadFile(request: UploadFileRequest): Promise<UploadFileResponse> {
        const formData = new FormData()
        formData.append('fileName', request.fileName)
        formData.append('contentType', request.contentType)
        formData.append('file', request.file)

        if (request.fileSize !== undefined) {
            formData.append('fileSize', request.fileSize.toString())
        }

        if (request.folder) {
            formData.append('folder', request.folder)
        }

        const { data } = await authClient.getAccessToken({ providerId: 'keycloak' })
        const token = data?.accessToken

        const response = await fetch(`${this.url}/upload`, {
            method: 'POST',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include',
            body: formData
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Erro ao fazer upload do arquivo')
        }

        return response.json()
    }

    /**
     * Faz download de um arquivo do S3
     */
    async downloadFile(objectKey: string): Promise<Blob> {
        const { data } = await authClient.getAccessToken({ providerId: 'keycloak' })
        const token = data?.accessToken

        const response = await fetch(`${this.url}/download/${objectKey}`, {
            method: 'GET',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            credentials: 'include'
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Erro ao fazer download do arquivo')
        }

        return response.blob()
    }

    /**
     * Deleta um arquivo do S3
     */
    async deleteFile(objectKey: string): Promise<void> {
        await HttpClient.delete<void>(`${this.url}/${objectKey}`)
    }

    /**
     * Gera uma URL pré-assinada para download
     */
    async generateDownloadUrl(request: PresignedUrlDownloadRequest): Promise<PresignedUrlResponse> {
        return HttpClient.post<PresignedUrlResponse>(`${this.url}/presigned-url/download`, request)
    }

    /**
     * Gera uma URL pré-assinada para upload
     */
    async generateUploadUrl(request: PresignedUrlUploadRequest): Promise<PresignedUrlResponse> {
        return HttpClient.post<PresignedUrlResponse>(`${this.url}/presigned-url/upload`, request)
    }

    /**
     * Gera uma URL pré-assinada para visualização
     */
    async generateViewUrl(objectKey: string, durationMinutes?: number): Promise<PresignedUrlResponse> {
        const params = new URLSearchParams()
        if (durationMinutes !== undefined) {
            params.append('duration', durationMinutes.toString())
        }

        const url = `${this.url}/presigned-url/view/${objectKey}${params.toString() ? `?${params.toString()}` : ''}`

        return HttpClient.get<PresignedUrlResponse>(url)
    }

    /**
     * Lista objetos no S3
     */
    async listObjects(params?: ListObjectsParams): Promise<ListObjectsResponse> {
        const queryParams = new URLSearchParams()

        if (params?.prefix) {
            queryParams.append('prefix', params.prefix)
        }

        if (params?.maxKeys !== undefined) {
            queryParams.append('maxKeys', params.maxKeys.toString())
        }

        const url = `${this.url}/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        return HttpClient.get<ListObjectsResponse>(url)
    }

    /**
     * Verifica se um objeto existe no S3
     */
    async objectExists(objectKey: string): Promise<ObjectExistsResponse> {
        return HttpClient.get<ObjectExistsResponse>(`${this.url}/exists/${objectKey}`)
    }

    /**
     * Obtém metadados de um objeto
     */
    async getObjectMetadata(objectKey: string): Promise<ObjectMetadata> {
        return HttpClient.get<ObjectMetadata>(`${this.url}/metadata/${objectKey}`)
    }

    /**
     * Copia um objeto no S3
     */
    async copyObject(source: string, destination: string): Promise<CopyMoveResponse> {
        const params = new URLSearchParams()
        params.append('source', source)
        params.append('destination', destination)

        return HttpClient.post<CopyMoveResponse>(`${this.url}/copy?${params.toString()}`, undefined)
    }

    /**
     * Move um objeto no S3
     */
    async moveObject(source: string, destination: string): Promise<CopyMoveResponse> {
        const params = new URLSearchParams()
        params.append('source', source)
        params.append('destination', destination)

        return HttpClient.post<CopyMoveResponse>(`${this.url}/move?${params.toString()}`, undefined)
    }

    /**
     * Faz upload direto para o S3 usando URL pré-assinada
     * Útil para uploads grandes sem passar pelo backend
     */
    async uploadToPresignedUrl(presignedUrl: string, file: File, contentType: string): Promise<void> {
        const response = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': contentType
            },
            body: file
        })

        if (!response.ok) {
            throw new Error('Erro ao fazer upload do arquivo')
        }
    }
}
