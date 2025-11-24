import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/signin')({
    component: SignInPage
})

function SignInPage() {
    useEffect(() => {
        authClient.signIn.social({
            provider: 'keycloak',
            callbackURL: '/'
        })
    }, [])

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Redirecionando para o login seguro...</p>
        </div>
    )
}
