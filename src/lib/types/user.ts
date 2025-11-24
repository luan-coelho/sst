import z from 'zod'

const userRoles = ['ADMIN', 'USER', 'MANAGER'] as const
const sortFields = ['name', 'email', 'cpf', 'phone', 'createdAt', 'updatedAt', 'active'] as const
const sortDirections = ['ASC', 'DESC'] as const

// Zod schemas for validation
const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    cpf: z.string(),
    phone: z.string().nullable().optional(),
    roles: z.array(z.enum(userRoles)),
    emailVerified: z.boolean().default(false),
    passwordMustChange: z.boolean().default(false),
    active: z.boolean().default(true),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional()
})

const createUserSchema = z.object({
    name: z
        .string()
        .min(2, 'Informe o nome com pelo menos 2 caracteres')
        .max(100, 'Nome não pode ter mais de 100 caracteres'),
    email: z.email('Informe um e-mail com um formato válido'),
    cpf: z.string().min(11, 'Informe um CPF válido'),
    phone: z.string().optional(),
    roles: z.array(z.enum(userRoles)).default(['USER']),
    active: z.boolean().default(true),
    emailVerified: z.boolean().default(false),
    passwordMustChange: z.boolean().default(false)
})

const updateUserSchema = z.object({
    name: z
        .string()
        .min(2, 'Informe o nome com pelo menos 2 caracteres')
        .max(100, 'Nome não pode ter mais de 100 caracteres')
        .optional(),
    email: z.email('Informe um e-mail com um formato válido').optional(),
    cpf: z.string().min(11, 'Informe um CPF válido').optional(),
    roles: z.array(z.enum(userRoles)).optional(),
    phone: z.string().optional(),
    active: z.boolean().optional(),
    emailVerified: z.boolean().optional(),
    passwordMustChange: z.boolean().optional()
})

const updateRolesSchema = z.object({
    roles: z.array(z.enum(userRoles)).min(1, 'Selecione pelo menos uma função')
})

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres')
})

// TypeScript types
type UserSchema = z.infer<typeof userSchema>
type CreateUserSchema = z.infer<typeof createUserSchema>
type UpdateUserSchema = z.infer<typeof updateUserSchema>
type UpdateRolesSchema = z.infer<typeof updateRolesSchema>
type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
type RoleSchema = (typeof userRoles)[number]
type SortField = (typeof sortFields)[number]
type SortDirection = (typeof sortDirections)[number]

export {
    changePasswordSchema,
    createUserSchema,
    sortDirections,
    sortFields,
    updateRolesSchema,
    updateUserSchema,
    userRoles,
    userSchema
}

export type {
    ChangePasswordSchema,
    CreateUserSchema,
    RoleSchema,
    SortDirection,
    SortField,
    UpdateRolesSchema,
    UpdateUserSchema,
    UserSchema
}
