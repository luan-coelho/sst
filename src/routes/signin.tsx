import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/signin')({
    component: SignIn
})

function SignIn() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col gap-4 rounded-lg border bg-white p-8 shadow-lg">
                <h1 className="text-center text-2xl font-bold">Sign In</h1>
                <button
                    className="cursor-pointer rounded bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
                    onClick={async () => {
                        await authClient.signIn.social({
                            provider: 'keycloak',
                            callbackURL: '/dashboard'
                        })
                    }}>
                    Sign in with Keycloak
                </button>
            </div>
        </div>
    )
}
