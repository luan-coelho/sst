import { AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorStateProps {
    title?: string
    message: string
}

export function ErrorState({ title, message }: ErrorStateProps) {
    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{title ?? 'Error'}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}
