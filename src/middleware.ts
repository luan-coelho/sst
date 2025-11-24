import { createMiddleware } from '@tanstack/react-start'
import { auth } from './lib/auth'

export const authMiddleware = createMiddleware().server(async ({ request, next }) => {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        return next({
            context: {
                user: session?.user,
                session: session?.session
            }
        })
    } catch (error) {
        throw error
    }
})
