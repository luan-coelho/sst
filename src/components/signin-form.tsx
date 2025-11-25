'use client'

import { useAuth } from '@//hooks/use-auth'
import { cn } from '@//lib/utils'
import { loginSchema, type LoginSchema } from '@//types/auth'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function SignInForm({ className, ...props }: React.ComponentProps<'form'>) {
    const { signIn } = useAuth()
    const router = useRouter()
    const [errors, setErrors] = useState<Partial<Record<keyof LoginSchema, string>>>({})

    const signInMutation = useMutation({
        mutationFn: async (credentials: LoginSchema) => {
            await signIn(credentials)
        },
        onSuccess: () => {
            toast.success('Login realizado com sucesso!')
            router.push('/')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Erro ao fazer login')
        }
    })

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrors({})

        const formData = new FormData(event.currentTarget)
        const credentials = {
            email: formData.get('email') as string,
            password: formData.get('password') as string
        }

        const result = loginSchema.safeParse(credentials)

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof LoginSchema, string>> = {}
            result.error.issues.forEach(issue => {
                const field = issue.path[0] as keyof LoginSchema
                if (field) {
                    fieldErrors[field] = issue.message
                }
            })
            setErrors(fieldErrors)
            return
        }

        signInMutation.mutate(result.data)
    }

    return (
        <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Acesse sua conta</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Digite seu email abaixo para acessar sua conta
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        disabled={signInMutation.isPending}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                        <p id="email-error" className="text-destructive mt-1 text-sm">
                            {errors.email}
                        </p>
                    )}
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Senha</FieldLabel>
                        <a href="#" className="text-primary ml-auto text-sm underline-offset-4 hover:underline">
                            Esqueceu sua senha?
                        </a>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        disabled={signInMutation.isPending}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    {errors.password && (
                        <p id="password-error" className="text-destructive mt-1 text-sm">
                            {errors.password}
                        </p>
                    )}
                </Field>
                <Field>
                    <Button type="submit" disabled={signInMutation.isPending}>
                        {signInMutation.isPending ? 'Acessando...' : 'Acessar'}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
