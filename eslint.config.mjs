import { builtinModules } from 'node:module'

import js from '@eslint/js'
import jsxA11y from '@htmlacademy/eslint-plugin-jsx-a11y'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import tailwind from 'eslint-plugin-better-tailwindcss'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

// A adoção de acessibilidade começa com avisos para revisão dos componentes existentes.
const accessibilityRules = Object.fromEntries(
    Object.entries(jsxA11y.flatConfigs.recommended.rules).map(([name, rule]) => {
        const [level, ...options] = Array.isArray(rule) ? rule : [rule]
        return [name, [level === 'off' || level === 0 ? 'off' : 'warn', ...options]]
    })
)

export default [
    {
        ignores: ['**/dist/**', '**/*.generated.js', '**/node_modules/**', '**/.github/**', '**/.next/**', '**/public/**', '**/.tailwind.*', '**/styles/*'],
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'jsx-a11y': jsxA11y,
            'better-tailwindcss': tailwind,
            'simple-import-sort': simpleImportSort,
        },
        settings: {
            'better-tailwindcss': { entryPoint: 'src/app/globals.css' },
            'jsx-a11y': { components: { Link: 'a', Image: 'img' } },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs['eslint-recommended'].overrides[0].rules,
            ...tsPlugin.configs.recommended.rules,
            ...accessibilityRules,

            'simple-import-sort/imports': 'warn',
            'simple-import-sort/exports': 'warn',
            'better-tailwindcss/enforce-canonical-classes': ['warn', { rootFontSize: 16 }],

            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-empty-object-type': 'warn',
            '@typescript-eslint/no-unsafe-function-type': 'warn',
            '@typescript-eslint/no-wrapper-object-types': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { args: 'all', caughtErrors: 'all' }],
            'prefer-const': 'warn',
            'prefer-template': 'warn',
            'dot-notation': 'warn',
            'no-restricted-imports': [
                'warn',
                { paths: builtinModules.filter((name) => !name.startsWith('node:')).map((name) => ({ name, message: `Use node:${name}.` })) },
            ],

            'jsx-a11y/prefer-tag-over-role': 'warn',
            'jsx-a11y/click-events-have-key-events': 'warn',
            'no-restricted-syntax': [
                'warn',
                {
                    selector:
                        "JSXElement[openingElement.name.name='svg']:not(:has(> JSXElement[openingElement.name.name='title'])):not(:has(JSXAttribute[name.name='aria-label'])):not(:has(JSXAttribute[name.name='aria-labelledby'])):not(:has(JSXAttribute[name.name='aria-hidden'][value.value='true'])):not(:has(JSXAttribute[name.name='aria-hidden'][value.expression.value=true]))",
                    message: 'Inclua um title ou nome acessível no SVG; use aria-hidden="true" se ele for decorativo.',
                },
            ],
        },
    },
    {
        files: ['src/**/*.{ts,tsx,mjs}'],
        ignores: ['src/lib/server/env.ts', 'src/instrumentation.ts'],
        rules: {
            'no-restricted-properties': ['error', { object: 'process', property: 'env', message: 'Use o módulo server-only de configuração centralizada.' }],
        },
    },
    {
        files: ['src/instrumentation.ts'],
        rules: {
            'no-restricted-syntax': [
                'error',
                {
                    selector:
                        "MemberExpression[object.name='process'][property.name='env']:not([parent.type='MemberExpression'][parent.computed=false][parent.property.name=/^(NEXT_RUNTIME|NEXT_PHASE)$/])",
                    message: 'A instrumentação pode ler apenas NEXT_RUNTIME e NEXT_PHASE; use o módulo central para a configuração.',
                },
            ],
        },
    },
    {
        // Controle opt-in do teste de integração isolado; não é configuração da loja.
        files: ['src/lib/__tests__/login-rate-limit-sql.test.ts', 'src/lib/__tests__/migration-runner-sql.test.ts'],
        rules: {
            'no-restricted-properties': 'off',
            'no-restricted-syntax': [
                'error',
                {
                    selector:
                        "MemberExpression[object.name='process'][property.name='env']:not([parent.type='MemberExpression'][parent.computed=false][parent.property.name='LOGIN_RATE_LIMIT_TEST_CONTAINER'])",
                    message: 'Este teste pode ler somente LOGIN_RATE_LIMIT_TEST_CONTAINER para escolher o contêiner descartável.',
                },
            ],
        },
    },
]
