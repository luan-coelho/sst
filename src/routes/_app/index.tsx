import { createFileRoute, getRouteApi } from '@tanstack/react-router'

const routeApi = getRouteApi('__root__')

export const Route = createFileRoute('/_app/')({
    component: RouteComponent
})

function RouteComponent() {
    const context = routeApi.useRouteContext()
    return (
        <div>
            <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
            <div className="rounded-lg p-6 shadow">
                <h2 className="mb-2 text-xl font-semibold">Welcome, {context.user?.name}!</h2>
                <p className="text-gray-600">Email: {context.user?.email}</p>
                <pre className="mt-4 overflow-auto rounded p-4 text-sm">{JSON.stringify(context.user, null, 2)}</pre>
            </div>
        </div>
    )
}
