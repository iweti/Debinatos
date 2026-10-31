## Problema e motivo

Descreva o problema, seu impacto e por que a alteração é necessária. Vincule a issue correspondente.

## Alteração

Explique o comportamento final e decisões que ajudam a revisar a solução.

## Validação

Registre os comandos executados, os resultados e qualquer verificação pendente. Use “não se aplica” quando necessário e explique o motivo.

- [ ] `npm ci` com Node de `.nvmrc` e npm de `packageManager`.
- [ ] `npx --no-install next typegen` e `make check`.
- [ ] `make test` e `npm run build`.
- [ ] `npm audit --omit=dev --audit-level=high`.
- [ ] Fluxos afetados conferidos; limitações e riscos descritos.

## Banco, configuração e publicação

- [ ] Migrações informadas, com ordem de aplicação, compatibilidade e recuperação descritas, ou ausência de migração registrada.
- [ ] Novas variáveis documentadas em `.env.example`, com validação e distinção de build/runtime, ou ausência de mudanças registrada.
- [ ] Nenhum segredo ou dado de produção incluído no código, fixtures, logs ou descrição.
- [ ] Dependências npm mantêm versões exatas, e o lockfile acompanha mudanças de dependências.
- [ ] Etapas manuais de publicação ou configuração remota, se houver, estão descritas com seu estado real.
