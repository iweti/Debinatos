export type EnvironmentSource = Readonly<Record<string, string | undefined>>

export type RuntimeEnv = Readonly<{
    DATABASE_URL: string
    SESSION_SECRET: string
    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
    CLOUDINARY_FOLDER: string
    WHATSAPP_PHONE: string | undefined
    NODE_ENV: 'development' | 'production' | 'test'
    VERCEL: '1' | undefined
}>

export const RUNTIME_ENV_KEYS: readonly (keyof RuntimeEnv)[]
export const PLATFORM_ENV_KEYS: readonly string[]
export class EnvironmentError extends Error {
    readonly variables: readonly string[]
    constructor(variables: readonly string[])
}
export function isPostgresUrl(value: unknown): boolean
export function isDirectPostgresUrl(value: unknown): boolean
export function validateRuntimeEnv(source: EnvironmentSource): RuntimeEnv
export function validateMigrationEnv(source: EnvironmentSource): Readonly<{ databaseUrl: string }>
export function validateValidationEnv(source: EnvironmentSource): Readonly<{ databaseUrl: string; sourceDatabaseUrl: string }>
