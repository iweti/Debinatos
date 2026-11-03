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
    const processes = new Set(['process'])
    const access = (node) => ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)
    const key = (node) =>
        ts.isPropertyAccessExpression(node) ? node.name.text : ts.isStringLiteral(node.argumentExpression) ? node.argumentExpression.text : null
    const processObject = (node) => node && ts.isIdentifier(node) && processes.has(node.text)
    const environment = (node) =>
        node && ((access(node) && key(node) === 'env' && processObject(node.expression)) || (ts.isIdentifier(node) && aliases.has(node.text)))
    const bindingKey = (item) => {
        const property = item.propertyName ?? item.name
        if (ts.isIdentifier(property) || ts.isStringLiteral(property)) return property.text
        if (ts.isComputedPropertyName(property) && ts.isStringLiteral(property.expression)) return property.expression.text
        throw new Error('Desestruturação dinâmica de variável de ambiente não pode ser conferida.')
    }
    const binding = (pattern, kind) => {
        if (ts.isIdentifier(pattern)) (kind === 'environment' ? aliases : processes).add(pattern.text)
        else if (ts.isObjectBindingPattern(pattern)) {
            for (const item of pattern.elements) {
                if (item.dotDotDotToken) binding(item.name, kind)
                else {
                    const name = bindingKey(item)
                    if (kind === 'environment') names.add(name)
                    else if (name === 'env') binding(item.name, 'environment')
                }
            }
        } else throw new Error('Desestruturação de variável de ambiente não pode ser conferida.')
    }
    const collect = (node) => {
        if (ts.isImportDeclaration(node) && ['node:process', 'process'].includes(node.moduleSpecifier.text)) {
            const clause = node.importClause
            if (clause?.name) processes.add(clause.name.text)
            const imported = clause?.namedBindings
            if (imported && ts.isNamespaceImport(imported)) processes.add(imported.name.text)
            else if (imported && ts.isNamedImports(imported)) {
                for (const item of imported.elements) {
                    const name = (item.propertyName ?? item.name).text
                    if (name === 'env') aliases.add(item.name.text)
                    else if (name === 'default') processes.add(item.name.text)
                }
            }
        }
        if (ts.isVariableDeclaration(node)) {
            if (environment(node.initializer)) binding(node.name, 'environment')
            else if (processObject(node.initializer)) binding(node.name, 'process')
        }
        ts.forEachChild(node, collect)
    }
    // Imports e aliases podem aparecer depois de funções que os utilizam.
    let known = -1
    while (known !== aliases.size + processes.size) {
        known = aliases.size + processes.size
        collect(file)
    }
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
