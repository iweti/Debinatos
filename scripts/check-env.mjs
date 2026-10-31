import { readFile, readdir } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

import {
    EnvironmentError,
    PLATFORM_ENV_KEYS,
    RUNTIME_ENV_KEYS,
    validateMigrationEnv,
    validateRuntimeEnv,
    validateValidationEnv,
} from '../src/lib/config/env.mjs'

// Um controle de teste não é uma configuração da loja. A exceção vale só aqui.
const testExceptions = { 'src/lib/__tests__/login-rate-limit-sql.test.ts': ['LOGIN_RATE_LIMIT_TEST_CONTAINER'] }

export async function environmentReferences(text, configuration = false) {
    const { default: ts } = await import('typescript')
    const file = ts.createSourceFile('source.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const names = new Set()
    const aliases = new Set()
    const access = (node) => ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)
    const key = (node) =>
        ts.isPropertyAccessExpression(node) ? node.name.text : ts.isStringLiteral(node.argumentExpression) ? node.argumentExpression.text : null
    const environment = (node) =>
        node &&
        ((access(node) && key(node) === 'env' && ts.isIdentifier(node.expression) && node.expression.text === 'process') ||
            (ts.isIdentifier(node) && aliases.has(node.text)))
    const collect = (node) => {
        if (ts.isVariableDeclaration(node) && environment(node.initializer)) {
            if (ts.isIdentifier(node.name)) aliases.add(node.name.text)
            else if (ts.isObjectBindingPattern(node.name)) for (const item of node.name.elements) names.add((item.propertyName ?? item.name).text)
        }
        ts.forEachChild(node, collect)
    }
    collect(file)
    const visit = (node) => {
        if (access(node) && (environment(node.expression) || (configuration && ts.isIdentifier(node.expression) && node.expression.text === 'source'))) {
            const name = key(node)
            if (!name && configuration) return // required(name) usa a lista RUNTIME_ENV_KEYS.
            if (!name) throw new Error('Acesso dinâmico a variável de ambiente não pode ser conferido.')
            names.add(name)
        }
        ts.forEachChild(node, visit)
    }
    visit(file)
    return names
}

export async function checkEnvironmentParity(root = resolve('.')) {
    const used = new Set(RUNTIME_ENV_KEYS)
    async function walk(folder) {
        for (const entry of await readdir(folder, { withFileTypes: true })) {
            const full = resolve(folder, entry.name)
            if (entry.isDirectory()) await walk(full)
            else if (/\.(?:ts|tsx|mjs)$/.test(entry.name) && !entry.name.endsWith('.d.mts')) {
                const name = relative(root, full).replaceAll('\\', '/')
                for (const variable of await environmentReferences(await readFile(full, 'utf8'), name === 'src/lib/config/env.mjs')) {
                    if (!testExceptions[name]?.includes(variable)) used.add(variable)
                }
            }
        }
    }
    await walk(resolve(root, 'src'))
    await walk(resolve(root, 'scripts'))
    const example = await readFile(resolve(root, '.env.example'), 'utf8')
    const documented = new Set([...example.matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((match) => match[1]))
    const missing = [...used].filter((key) => !documented.has(key) && !PLATFORM_ENV_KEYS.includes(key)).sort()
    const unused = [...documented].filter((key) => !used.has(key)).sort()
    if (missing.length || unused.length) throw new Error(`Paridade de configuração: ausentes [${missing.join(', ')}]; sem uso [${unused.join(', ')}].`)
}

export async function checkEnvironment(args, source) {
    const { values } = parseArgs({ args, options: { context: { type: 'string', default: 'runtime' }, parity: { type: 'boolean', default: false } } })
    if (values.parity) return checkEnvironmentParity()
    const validators = { runtime: validateRuntimeEnv, migration: validateMigrationEnv, validation: validateValidationEnv }
    if (!Object.hasOwn(validators, values.context)) throw new Error('Use --context=runtime, migration ou validation.')
    validators[values.context](source)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        await checkEnvironment(process.argv.slice(2), process.env)
        console.log('Configuração verificada.')
    } catch (error) {
        console.error(error instanceof EnvironmentError ? error.message : error instanceof Error ? error.message : 'Não foi possível verificar a configuração.')
        process.exitCode = 1
    }
}
