/**
 * Tipos para integração com a API S3
 */

export interface UploadFileRequest {
    fileName: string
    contentType: string
    file: File
    fileSize?: number
    folder?: string
}

export interface UploadFileResponse {
    objectKey: string
    fileName: string
    contentType: string
    fileSize: number
    url: string
    uploadedAt: string
}

export interface PresignedUrlDownloadRequest {
    objectKey: string
    durationMinutes?: number
    contentType?: string
}

export interface PresignedUrlUploadRequest {
    objectKey: string
    contentType: string
    durationMinutes?: number
}

export interface PresignedUrlResponse {
    presignedUrl: string
    objectKey: string
    expiresAt: string
    durationMinutes: number
}

export interface S3Object {
    key: string
    size: number
    lastModified: string
    etag: string
    storageClass: string
}

export interface ListObjectsResponse {
    objects: Array<S3Object>
    totalCount: number
    prefix: string
    maxKeys: number
}

export interface ObjectExistsResponse {
    objectKey: string
    exists: boolean
}

export interface ObjectMetadata {
    key: string
    size: number
    contentType: string
    lastModified: string
    etag: string
    metadata?: Record<string, string>
}

export interface CopyMoveResponse {
    message: string
}

export interface ListObjectsParams {
    prefix?: string
    maxKeys?: number
}
