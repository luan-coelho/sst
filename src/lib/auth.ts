import { env } from '@/env'
import { betterAuth } from 'better-auth'
import { genericOAuth, keycloak } from 'better-auth/plugins'

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
