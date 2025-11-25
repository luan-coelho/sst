import { createServerFn } from '@tanstack/react-start'
import { env } from '../env'

export const getLogoutUrl = createServerFn().handler(async () => {
    const keycloakIssuer = env.KEYCLOAK_ISSUER
    const redirectUrl = 'http://localhost:3000/signin'
    const clientId = env.KEYCLOAK_CLIENT_ID
    const logoutUrl = `${keycloakIssuer}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(redirectUrl)}&client_id=${clientId}`
    return logoutUrl
})
