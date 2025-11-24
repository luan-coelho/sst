import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { ReactQueryClientProvider } from './react-query-provider'
import { ThemeProvider } from './theme-provider'

export function getContext() {
    const queryClient = new QueryClient()
    return {
        queryClient
    }
}

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryClientProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                storageKey="sst-theme">
                {children}
                <Toaster
                    expand
                    richColors
                    toastOptions={{
                        duration: 5000
                    }}
                />
                <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
        </ReactQueryClientProvider>
    )
}
