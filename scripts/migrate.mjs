import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { neon } from '@neondatabase/serverless'

import { validateMigrationEnv } from '../src/lib/config/env.mjs'

// Preserve quoted strings, comments and PL/pgSQL bodies when batching SQL over HTTP.
export function splitSql(source) {
    const statements = []
    let statement = ''
    let quote = ''
    let dollar = ''
    let lineComment = false
    let blockDepth = 0
    for (let index = 0; index < source.length; index++) {
        const char = source[index]
        const next = source[index + 1]
        statement += char
        if (lineComment) {
            if (char === '\n') lineComment = false
        } else if (blockDepth) {
            if (char === '/' && next === '*') {
                blockDepth++
                statement += next
                index++
            } else if (char === '*' && next === '/') {
                blockDepth--
                statement += next
                index++
            }
        } else if (dollar) {
            if (source.startsWith(dollar, index)) {
                statement += dollar.slice(1)
                index += dollar.length - 1
                dollar = ''
            }
        } else if (quote) {
            if (char === quote && next === quote) {
                statement += next
                index++
            } else if (char === quote) quote = ''
        } else if (char === '-' && next === '-') {
            lineComment = true
            statement += next
            index++
        } else if (char === '/' && next === '*') {
            blockDepth = 1
            statement += next
            index++
        } else if (char === "'" || char === '"') quote = char
        else if (char === '$') {
            const match = source.slice(index).match(/^\$(?:[A-Za-z_][A-Za-z_0-9]*)?\$/)
            if (match) {
                dollar = match[0]
                statement += dollar.slice(1)
                index += dollar.length - 1
            }
        } else if (char === ';') {
            statements.push(statement.slice(0, -1).trim())
            statement = ''
        }
    }
    if (statement.trim()) statements.push(statement.trim())
    return statements.filter((sql) => {
        const meaningful = sql.replace(/--[^\n]*/g, '').trim()
        return meaningful && !/^(BEGIN|COMMIT)$/i.test(meaningful)
    })
}

export async function migrationStatements(filename) {
    return splitSql(await readFile(resolve('migrations', filename), 'utf8'))
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const filename = process.argv[2]
    const { databaseUrl: connection } = validateMigrationEnv(process.env)
    if (!/^00[1-7]_[\w]+\.sql$/.test(filename ?? '')) throw new Error('Informe o nome de uma migração versionada.')
    const sql = neon(connection)
    const statements = await migrationStatements(filename)
    await sql.transaction(statements.map((statement) => sql.query(statement)))
    console.log(`Migração aplicada: ${filename}`)
}
