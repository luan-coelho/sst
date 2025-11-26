import { S3Service } from '@/lib/services/s3-service'
import type {
    ListObjectsParams,
    PresignedUrlDownloadRequest,
    PresignedUrlUploadRequest,
    UploadFileRequest
} from '@/lib/types/s3'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * Hook para fazer upload de arquivos
 */
export function useUploadFile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (request: UploadFileRequest) => S3Service.uploadFile(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['s3-objects'] })
        }
    })
}

/**
 * Hook para deletar arquivos
 */
export function useDeleteFile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (objectKey: string) => S3Service.deleteFile(objectKey),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['s3-objects'] })
        }
    })
}

/**
 * Hook para gerar URL de download
 */
export function useGenerateDownloadUrl() {
    return useMutation({
        mutationFn: (request: PresignedUrlDownloadRequest) => S3Service.generateDownloadUrl(request)
    })
}

/**
 * Hook para gerar URL de upload
 */
export function useGenerateUploadUrl() {
    return useMutation({
        mutationFn: (request: PresignedUrlUploadRequest) => S3Service.generateUploadUrl(request)
    })
}

/**
 * Hook para gerar URL de visualização
 */
export function useGenerateViewUrl() {
    return useMutation({
        mutationFn: ({ objectKey, duration }: { objectKey: string; duration?: number }) =>
            S3Service.generateViewUrl(objectKey, duration)
    })
}

/**
 * Hook para listar objetos
 */
export function useListObjects(params?: ListObjectsParams) {
    return useQuery({
        queryKey: ['s3-objects', params],
        queryFn: () => S3Service.listObjects(params)
    })
}

/**
 * Hook para verificar se objeto existe
 */
export function useObjectExists(objectKey: string) {
    return useQuery({
        queryKey: ['s3-object-exists', objectKey],
        queryFn: () => S3Service.objectExists(objectKey),
        enabled: !!objectKey
    })
}

/**
 * Hook para obter metadados do objeto
 */
export function useObjectMetadata(objectKey: string) {
    return useQuery({
        queryKey: ['s3-object-metadata', objectKey],
        queryFn: () => S3Service.getObjectMetadata(objectKey),
        enabled: !!objectKey
    })
}

/**
 * Hook para copiar objetos
 */
export function useCopyObject() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ source, destination }: { source: string; destination: string }) =>
            S3Service.copyObject(source, destination),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['s3-objects'] })
        }
    })
}

/**
 * Hook para mover objetos
 */
export function useMoveObject() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ source, destination }: { source: string; destination: string }) =>
            S3Service.moveObject(source, destination),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['s3-objects'] })
        }
    })
}

/**
 * Hook para fazer download de arquivo
 */
export function useDownloadFile() {
    return useMutation({
        mutationFn: async (objectKey: string) => {
            const blob = await S3Service.downloadFile(objectKey)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = objectKey.split('/').pop() || 'download'
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        }
    })
}

/**
 * Hook para upload direto usando URL pré-assinada
 */
export function useUploadToPresignedUrl() {
    return useMutation({
        mutationFn: ({ presignedUrl, file, contentType }: { presignedUrl: string; file: File; contentType: string }) =>
            S3Service.uploadToPresignedUrl(presignedUrl, file, contentType)
    })
}
