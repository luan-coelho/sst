import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/signin')({
    head: () => ({
        meta: [
            {
                title: 'SST AuditorIA - Login'
            }
        ]
    }),
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
        <div className="bg-background flex h-screen w-full items-center justify-center">
            <div className="text-primary flex flex-col items-center justify-center gap-4 text-center font-semibold">
                <Loader2 className="size-8 animate-spin" />
                <p>Redirecionando para o login seguro...</p>
            </div>
        </div>
    )
}
