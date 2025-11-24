import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
// Import the generated route tree
import NotFound from './components/not-found'
import * as RootProvider from './providers/root-provider'
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
    const context = RootProvider.getContext()

    const router = createRouter({
        routeTree,
        context: { ...context },
        defaultPreload: 'intent',
        defaultNotFoundComponent: () => <NotFound />,
        scrollRestoration: true,
        Wrap: (props: { children: React.ReactNode }) => {
            return <RootProvider.Provider {...context}>{props.children}</RootProvider.Provider>
        }
    })

    setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

    return router
}
