import { createHash } from 'node:crypto'
import { lstat, readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

import { neon } from '@neondatabase/serverless'

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

const migrationDirectory = fileURLToPath(new URL('../migrations/', import.meta.url))
const filenamePattern = /^(\d{3,6})_[a-z][a-z0-9_]*\.sql$/

export function migrationVersion(filename) {
    const match = typeof filename === 'string' && filename.match(filenamePattern)
    if (!match || Number(match[1]) < 1) throw new Error('Informe somente o nome de uma migração versionada, sem caminho.')
    return Number(match[1])
}

export async function migrationStatements(filename) {
    migrationVersion(filename)
    return splitSql(await readFile(resolve(migrationDirectory, filename), 'utf8'))
}

function reference(value, purpose) {
    try {
        const url = new URL(value)
        if (url.protocol === 'https:' && !url.username && !url.password && value.length <= 500) return value
    } catch {
        /* Mensagem abaixo é deliberadamente independente do valor informado. */
    }
    throw new Error(`Informe uma referência HTTPS de ${purpose}.`)
}

export async function migrationPlan(filename, options = {}) {
    migrationVersion(filename)
    const directory = options.directory ?? migrationDirectory
    const filenames = (await readdir(directory)).filter((name) => name.endsWith('.sql'))
    const catalog = []
    for (const name of filenames) {
        const version = migrationVersion(name)
        const path = resolve(directory, name)
        if (!(await lstat(path)).isFile()) throw new Error('Migrações devem ser arquivos regulares, sem links simbólicos.')
        const source = await readFile(path, 'utf8')
        catalog.push({ version, filename: name, checksum: createHash('sha256').update(source).digest('hex'), statements: splitSql(source) })
    }
    catalog.sort((left, right) => left.version - right.version)
    if (catalog.some((entry, index) => entry.version !== index + 1))
        throw new Error('As versões das migrações devem ser únicas e consecutivas, iniciando em 001.')
    const target = catalog.find((entry) => entry.filename === filename)
    if (!target) throw new Error('A migração informada não existe no catálogo deste commit.')
    let evidence = null
    if (options.baseline) {
        if (!options.baselineInspected || target.version > 7)
            throw new Error('Baseline é exclusivo de 001–007 já inspecionadas; confirme --baseline-inspected.')
        evidence = reference(options.inspectionReference, 'inspeção do schema existente')
    } else if (!options.verify && target.version === 4) {
        if (!/^[a-f0-9]{40}$/.test(options.compatibleSha ?? '')) throw new Error('A migração 004 exige --compatible-sha publicado e validado (SHA completo).')
        evidence = `${options.compatibleSha} ${reference(options.validationReference, 'validação da aplicação publicada')}`
    }
    return { catalog, target, baseline: options.baseline === true, verify: options.verify === true, evidence }
}

const literal = (value) => `'${String(value).replaceAll("'", "''")}'`
function dollarQuote(value) {
    let index = 0
    let delimiter = '$debinatos_runner$'
    while (value.includes(delimiter)) delimiter = `$debinatos_runner_${++index}$`
    return `${delimiter}${value}${delimiter}`
}

// O lock, a decisão de executar e o registro ocorrem no servidor na mesma
// transação HTTP. Ler o histórico em outra requisição criaria uma corrida.
export function migrationTransaction(plan) {
    const { catalog, target, baseline, verify, evidence } = plan
    const expected = catalog.map(({ version, filename, checksum }) => ({ version, filename, checksum }))
    const expectedRows = `jsonb_to_recordset(expected) AS e(version integer, filename text, checksum text)`
    const validateHistory = `
        FOR applied IN SELECT * FROM public.schema_migrations LOOP
            IF NOT EXISTS (SELECT 1 FROM ${expectedRows}
                WHERE e.version = applied.version AND e.filename = applied.filename AND e.checksum = applied.checksum) THEN
                RAISE EXCEPTION 'MIGRATION_HISTORY_CONFLICT';
            END IF;
        END LOOP;
        IF EXISTS (SELECT 1 FROM ${expectedRows}
            WHERE e.version <= (SELECT max(version) FROM public.schema_migrations)
              AND NOT EXISTS (SELECT 1 FROM public.schema_migrations m WHERE m.version = e.version)) THEN
            RAISE EXCEPTION 'MIGRATION_HISTORY_GAP';
        END IF;`
    let operation
    if (verify) {
        operation = `IF EXISTS (SELECT 1 FROM ${expectedRows} WHERE e.version <= ${target.version} AND NOT EXISTS (SELECT 1 FROM public.schema_migrations m WHERE m.version = e.version)) THEN RAISE EXCEPTION 'MIGRATION_PREDECESSOR_REQUIRED'; END IF;`
    } else if (baseline) {
        const required = ['admin_users']
        if (target.version >= 2) required.push('products')
        if (target.version >= 3) required.push('product_images', 'hero_products')
        if (target.version >= 7) required.push('admin_login_attempts')
        const checks = required.map((name) => `IF to_regclass('public.${name}') IS NULL THEN RAISE EXCEPTION 'BASELINE_SCHEMA_MISMATCH'; END IF;`)
        if (target.version >= 4)
            checks.push(
                `IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND ((table_name = 'products' AND column_name = 'img') OR (table_name = 'hero_products' AND column_name = 'image_url'))) THEN RAISE EXCEPTION 'BASELINE_SCHEMA_MISMATCH'; END IF;`
            )
        if (target.version >= 5)
            checks.push(
                `IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'price_cents'${target.version >= 6 ? " AND is_nullable = 'NO'" : ''}) THEN RAISE EXCEPTION 'BASELINE_SCHEMA_MISMATCH'; END IF;`
            )
        if (target.version >= 7)
            checks.push(`IF to_regprocedure('public.consume_admin_login_attempt(text,text)') IS NULL THEN RAISE EXCEPTION 'BASELINE_SCHEMA_MISMATCH'; END IF;`)
        operation = `${checks.join('\n')}
            INSERT INTO public.schema_migrations (version, filename, checksum, method, evidence)
            SELECT e.version, e.filename, e.checksum, 'baseline', ${literal(evidence)} FROM ${expectedRows}
            WHERE e.version <= ${target.version} ON CONFLICT (version) DO NOTHING;`
    } else {
        operation = `
            IF NOT EXISTS (SELECT 1 FROM public.schema_migrations WHERE version = ${target.version}) THEN
                IF EXISTS (SELECT 1 FROM ${expectedRows}
                    WHERE e.version < ${target.version} AND NOT EXISTS (SELECT 1 FROM public.schema_migrations m WHERE m.version = e.version)) THEN
                    RAISE EXCEPTION 'MIGRATION_PREDECESSOR_REQUIRED';
                END IF;
                ${target.statements.map((statement) => `EXECUTE ${literal(statement)};`).join('\n')}
                INSERT INTO public.schema_migrations (version, filename, checksum, method, evidence)
                VALUES (${target.version}, ${literal(target.filename)}, ${literal(target.checksum)}, 'applied', ${evidence ? literal(evidence) : 'NULL'});
            END IF;`
    }
    const body = `DECLARE expected jsonb := ${literal(JSON.stringify(expected))}::jsonb; applied record;
        BEGIN ${validateHistory} ${operation} END;`
    return [
        "SET LOCAL lock_timeout = '5s'",
        "SET LOCAL statement_timeout = '120s'",
        'SET LOCAL standard_conforming_strings = on',
        'SET LOCAL search_path = public, pg_catalog',
        'SELECT pg_advisory_xact_lock(77120017)',
        ...(!verify
            ? [
                  `CREATE TABLE IF NOT EXISTS public.schema_migrations (
            version integer PRIMARY KEY CHECK (version > 0), filename text NOT NULL UNIQUE,
            checksum text NOT NULL CHECK (checksum ~ '^[a-f0-9]{64}$'),
            applied_at timestamptz NOT NULL DEFAULT clock_timestamp(),
            method text NOT NULL CHECK (method IN ('applied', 'baseline')), evidence text
        )`,
              ]
            : []),
        `DO ${dollarQuote(body)}`,
        'SELECT version, filename, method FROM public.schema_migrations ORDER BY version',
    ]
}

export async function runMigration(args, source) {
    const { values, positionals } = parseArgs({
        args,
        allowPositionals: true,
        options: {
            'verify-through': { type: 'string' },
            'baseline-through': { type: 'string' },
            'baseline-inspected': { type: 'boolean', default: false },
            'inspection-reference': { type: 'string' },
            'compatible-sha': { type: 'string' },
            'validation-reference': { type: 'string' },
        },
    })
    const baseline = !!values['baseline-through']
    const verify = !!values['verify-through']
    if ((baseline && verify) || positionals.length !== (baseline || verify ? 0 : 1)) throw new Error('Informe uma migração ou --baseline-through, nunca ambos.')
    const plan = await migrationPlan(values['baseline-through'] ?? values['verify-through'] ?? positionals[0], {
        baseline,
        verify,
        baselineInspected: values['baseline-inspected'],
        inspectionReference: values['inspection-reference'],
        compatibleSha: values['compatible-sha'],
        validationReference: values['validation-reference'],
    })
    // Import tardio mantém os utilitários SQL independentes da configuração runtime.
    const { validateMigrationEnv } = await import('../src/lib/config/env.mjs')
    const { databaseUrl } = validateMigrationEnv(source)
    const sql = neon(databaseUrl)
    await sql.transaction(
        migrationTransaction(plan).map((statement) => sql.query(statement)),
        { readOnly: verify }
    )
    console.log(`${verify ? 'Histórico validado' : baseline ? 'Baseline registrado' : 'Migração verificada/aplicada'}: ${plan.target.filename}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        await runMigration(process.argv.slice(2), process.env)
    } catch {
        // Erros do driver podem conter SQL/credenciais. Diagnóstico interno nunca
        // vai para logs compartilhados; o histórico fica intacto em caso de falha.
        console.error('Migração interrompida. Confira argumentos, configuração, ordem e histórico; nenhuma alteração parcial foi confirmada.')
        process.exitCode = 1
    }
}
