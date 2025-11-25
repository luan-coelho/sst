import { env } from '@/env'

/**
 * Environment utilities for type-safe access to environment variables.
 *
 * This module provides helper functions to access environment variables
 * with runtime validation and type safety.
 */

/**
 * Get the API URL based on the current environment (client or server).
 *
 * On the server, returns the internal API_URL.
 * On the client, returns the public NEXT_PUBLIC_API_URL.
 *
 * @returns The appropriate API URL for the current environment
 *
 * @example
 * ```ts
 * // In a Server Component or API Route
 * const apiUrl = getApiUrl() // Returns API_URL
 *
 * // In a Client Component
 * const apiUrl = getApiUrl() // Returns NEXT_PUBLIC_API_URL
 * ```
 */
export function getApiUrl(): string {
    // Check if we're on the server
    if (typeof window === 'undefined') {
        return env.API_URL
    }

    // We're on the client
    return env.VITE_API_URL
}

// =============================================================================
// SERVER-ONLY UTILITIES
// These functions can only be used in Server Components, API Routes, or Server Actions
// =============================================================================

/**
 * Check if the application is running in development mode.
 * ⚠️ SERVER ONLY - This function can only be used on the server.
 *
 * @returns true if NODE_ENV is 'development'
 */
export function isDevelopment(): boolean {
    if (typeof window !== 'undefined') {
        throw new Error('isDevelopment() can only be used on the server')
    }
    return env.NODE_ENV === 'development'
}

/**
 * Check if the application is running in production mode.
 * ⚠️ SERVER ONLY - This function can only be used on the server.
 *
 * @returns true if NODE_ENV is 'production'
 */
export function isProduction(): boolean {
    if (typeof window !== 'undefined') {
        throw new Error('isProduction() can only be used on the server')
    }
    return env.NODE_ENV === 'production'
}

/**
 * Check if the application is running in test mode.
 * ⚠️ SERVER ONLY - This function can only be used on the server.
 *
 * @returns true if NODE_ENV is 'test'
 */
export function isTest(): boolean {
    if (typeof window !== 'undefined') {
        throw new Error('isTest() can only be used on the server')
    }
    return env.NODE_ENV === 'test'
}

/**
 * Get the server-side API URL.
 * ⚠️ SERVER ONLY - This function can only be used on the server.
 *
 * @returns The internal API URL
 */
export function getServerApiUrl(): string {
    if (typeof window !== 'undefined') {
        throw new Error('getServerApiUrl() can only be used on the server')
    }
    return env.API_URL
}
