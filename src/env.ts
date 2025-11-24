import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
    server: {
        SERVER_URL: z.string().url().optional(),
        KEYCLOAK_CLIENT_ID: z.string().min(1),
        KEYCLOAK_CLIENT_SECRET: z.string().min(1),
        KEYCLOAK_ISSUER: z.string().min(1)
    },

    clientPrefix: 'VITE_',

    client: {
        VITE_API_URL: z.string().min(1),
        VITE_APP_TITLE: z.string().min(1).optional()
    },

    shared: {
        API_URL: z.string().min(1)
    },

    runtimeEnv: {
        SERVER_URL: process.env.SERVER_URL,
        KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
        KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
        KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
        VITE_API_URL: import.meta.env.VITE_API_URL,
        VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
        API_URL: import.meta.env.VITE_API_URL || process.env.API_URL
    },

    /**
     * By default, this library will feed the environment variables directly to
     * the Zod validator.
     *
     * This means that if you have an empty string for a value that is supposed
     * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
     * it as a type mismatch violation. Additionally, if you have an empty string
     * for a value that is supposed to be a string with a default value (e.g.
     * `DOMAIN=` in an ".env" file), the default value will never be applied.
     *
     * In order to solve these issues, we recommend that all new projects
     * explicitly specify this option as true.
     */
    emptyStringAsUndefined: true
})
