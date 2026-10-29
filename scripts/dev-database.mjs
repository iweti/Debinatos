import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

// This guard deliberately targets the existing development branch, never the default branch.
export async function devDatabaseConnection() {
    const context = JSON.parse(await readFile(new URL('../.neon', import.meta.url), 'utf8'))
    assert.equal(context.projectId, 'gentle-sound-08509878', 'Projeto Neon inesperado.')
    assert.equal(context.branch, 'dev', 'Esta operação é exclusiva da branch dev.')
    const value = process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
    assert.ok(value, 'Defina a conexão da branch dev.')
    const connection = new URL(value)
    assert.ok(
        ['ep-lucky-wildflower-b6z93hs6.c-2.sa-east-1.aws.neon.tech', 'ep-lucky-wildflower-b6z93hs6-pooler.c-2.sa-east-1.aws.neon.tech'].includes(
            connection.hostname
        ),
        'O endpoint não corresponde à branch dev verificada. Confira-o no Neon antes de atualizar a proteção.'
    )
    connection.hostname = connection.hostname.replace('-pooler.', '.')
    return connection.toString()
}
