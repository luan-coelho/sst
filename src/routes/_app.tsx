import { env } from '@/env'
import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { authClient } from '../lib/auth-client'

export const getLogoutUrl = createServerFn().handler(async () => {
    const keycloakIssuer = env.KEYCLOAK_ISSUER
    const redirectUrl = 'http://localhost:3000/signin'
    const clientId = env.KEYCLOAK_CLIENT_ID
    const logoutUrl = `${keycloakIssuer}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(redirectUrl)}&client_id=${clientId}`
    return logoutUrl
})

export const Route = createFileRoute('/_app')({
    component: AppLayout
})

function AppLayout() {
    const navigate = useNavigate()
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: async () => {
                    const logoutUrl = await getLogoutUrl()
                    navigate({
                        href: logoutUrl,
                        reloadDocument: true
                    })
                }
            }
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <span className="text-xl font-bold">MyApp</span>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    activeProps={{
                                        className: 'border-black text-gray-900'
                                    }}>
                                    Dashboard
                                </Link>
                                <Link
                                    to="/profile"
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    activeProps={{
                                        className: 'border-black text-gray-900'
                                    }}>
                                    Profile
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleSignOut}
                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
