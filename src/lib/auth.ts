import { betterAuth } from 'better-auth'
import { genericOAuth, keycloak } from 'better-auth/plugins'
import { env } from '@/env'

export const auth = betterAuth({
    plugins: [
        genericOAuth({
            config: [
                keycloak({
                    clientId: env.KEYCLOAK_CLIENT_ID,
                    clientSecret: env.KEYCLOAK_CLIENT_SECRET,
                    issuer: env.KEYCLOAK_ISSUER
                })
            ]
        })
    ]
})
