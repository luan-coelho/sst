import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
    server: {
        API_URL: z.url(),
        KEYCLOAK_CLIENT_ID: z.string().min(1),
        KEYCLOAK_CLIENT_SECRET: z.string().min(1),
        KEYCLOAK_ISSUER: z.string().min(1),
        NODE_ENV: z.enum(['development', 'production', 'test']),
        // Adicionei as variáveis do Better Auth que estavam no seu .env mas fora do schema
        BETTER_AUTH_URL: z.string().url().optional(),
        BETTER_AUTH_SECRET: z.string().min(1).optional()
    },

    clientPrefix: 'VITE_',

    client: {
        VITE_API_URL: z.url()
    },

    // --- A CORREÇÃO ESTÁ AQUI ---
    // Em projetos Vite/Client-side, você DEVE listar cada chave manualmente.
    // O bundler não consegue ler `process.env[key]` dinamicamente.
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        API_URL: process.env.API_URL,
        KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
        KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
        KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

        // Variáveis CLIENTE vêm de import.meta.env
        VITE_API_URL: import.meta.env.VITE_API_URL
    },

    emptyStringAsUndefined: true
})
