# Publicação e migrações

A plataforma escolhida é o projeto **debinatos** já existente na Vercel. Next.js continua responsável pelo build; o GitHub Actions só publica o artefato do commit que passou no workflow CI. O arquivo [vercel.json](../vercel.json) desabilita deploy automático pela integração Git para que um push não contorne esse gate. Revise essa mudança antes de mesclar: depois que a configuração alcançar a branch, novas publicações dependem da habilitação descrita abaixo.

Esta PR entrega código e procedimento revisáveis. **Nenhum environment, reviewer, secret ou proteção remota foi criado/configurado, nenhum deploy foi feito e nenhum banco real foi alterado.** Os workflows ficam desligados enquanto as variáveis de habilitação estiverem ausentes. Um YAML que menciona `environment: production` não cria sozinho uma regra de aprovação obrigatória.

## Ambientes e habilitação pelo responsável

| GitHub Environment | Branch permitida | Destino Vercel | Banco/segredos |
| --- | --- | --- | --- |
| `preview` | `dev` | Preview, disparo manual após CI verde | Exclusivos de preview |
| `staging` | `dev` | Preview, automático após CI verde | Exclusivos de staging |
| `production` | `main` | Production, após aprovação obrigatória | Exclusivos de produção |

Antes de definir qualquer variável de habilitação:

1. Aplicar/revisar a governança da [issue #16](https://github.com/iweti/Debinatos/issues/16): branches protegidas, revisão e check `Validação` obrigatório em `dev`/`main`.
2. Criar os três GitHub Environments. Restringir deployment branches pelos nomes exatos da tabela, configurar reviewers obrigatórios (obrigatório em produção), impedir autoaprovação e impedir bypass administrativo onde disponível. Se o plano não suportar essas regras, manter o CD/migrações desligados até existir proteção equivalente.
3. Configurar **secrets por environment**, nunca no nível geral do repositório: `VERCEL_TOKEN` de menor acesso possível e `MIGRATION_DATABASE_URL` direta do banco correspondente. O token só é injetado nos passos Vercel, e a conexão só nos passos de banco. Os IDs públicos já estão fixados no workflow: projeto `prj_gT1UYRuRyeuJMkHtmMee4bl5HmVX`, organização `team_qSsneVzWahDtXXUtgMZzNrp0`. Confirmar que continuam corretos antes de habilitar.
4. Na Vercel, configurar `DATABASE_URL`, `SESSION_SECRET`, as variáveis Cloudinary e as opcionais por destino. Para `dev`, o workflow usa as variáveis Preview da branch `dev`; preview e staging precisam de segredos GitHub separados e usam a configuração Vercel Preview de `dev` deste projeto. Isolamento adicional entre os dois destinos exige projetos/custom environments próprios e revisão deste mapeamento. Não apontar esses destinos ao banco de produção.
5. Inspecionar o banco de cada ambiente e inicializar o histórico conforme a seção de baseline. O CD exige registro consistente até `007_admin_login_rate_limit.sql`, sem executar SQL de migração.
6. Em cada environment protegido, definir `RELEASE_PROTECTION_CONFIGURED=true` **somente depois** de conferir as regras e o mapeamento de segredos. Essa variável é uma declaração do operador; o workflow não tem permissão administrativa para instalar ou auditar reviewers remotos.
7. Só então definir as variáveis **do repositório** `DEPLOYMENTS_ENABLED=true` e, separadamente, `MIGRATIONS_ENABLED=true`. Ausência ou qualquer outro valor mantém os respectivos jobs desabilitados.

`workflow_run` usa a definição de workflow da branch padrão do GitHub. A configuração precisa chegar a ela antes de o CD automático funcionar; mesclar apenas em `dev` pode não ativá-lo. Publicações locais com acesso direto à Vercel continuam sendo uma capacidade administrativa: restrinja esse acesso e os deploy hooks. Não armazene tokens em PRs, arquivos de configuração ou argumentos `--token`.

## Fluxo de publicação

O [CD](../.github/workflows/deploy.yml) aceita somente um CI **de push**, concluído com sucesso no mesmo repositório e SHA atual de `dev`/`main`. O gate consulta novamente o GitHub, usa especificamente o workflow `ci.yml` e faz checkout do SHA completo; um CI de PR/fork ou outra branch nunca ganha segredos. O disparo manual também exige CI verde de push desse mesmo SHA e o par branch/environment permitido.

Depois da aprovação do environment, ele instala Node de [.nvmrc](../.nvmrc), npm do manifesto e Vercel CLI **65.9.0**; executa instalação reproduzível, `check:env --context=migration` e verificação read-only do histórico até 007. `vercel pull` busca configuração, a identidade do projeto é conferida e `check:env --context=runtime` valida as variáveis puxadas antes do build. Os arquivos `.vercel` são ignorados pelo Git, não viram artifacts/cache e são removidos ao terminar.

O build usa `--prebuilt` para a publicação do mesmo artefato. Produção é criada com `--skip-domain`, recebe smoke HTTP de `/` e `/catalogo` via `vercel curl` (inclusive sob Deployment Protection) e só então é promovida pelo mesmo URL. Falha nesses passos impede promoção de produção. Preview/staging recebem os mesmos smoke checks, mas uma falha neles não remove o URL recém-criado. Os smoke checks comprovam resposta HTTP; não substituem testes de login, conteúdo do catálogo, upload e regras de negócio. O CI e a validação de schema dão evidências complementares.

Deploy e migração compartilham `concurrency: release-<environment>` e não cancelam uma operação em curso. A branch é conferida outra vez antes de criar o deploy para evitar publicar um SHA ultrapassado durante o build. Mudanças futuras na política de schema exigem revisar o requisito explícito `--verify-through 007_admin_login_rate_limit.sql` junto com o código que depende delas.

## Migração de um banco novo

Nunca use a conexão pooled. Configure `MIGRATION_DATABASE_URL` ou, localmente, `DATABASE_URL_UNPOOLED`; o validador compartilhado recusa `-pooler`. Teste primeiro em PostgreSQL descartável ou uma branch Neon isolada com dados representativos. Não execute migrações no build nem no boot.

```sh
node --env-file=.env.local scripts/check-env.mjs --context=migration
node --env-file=.env.local scripts/migrate.mjs 001_admin_users.sql
node --env-file=.env.local scripts/migrate.mjs 002_products.sql
node --env-file=.env.local scripts/migrate.mjs 003_product_images_highlights.sql
# Pausa obrigatória: publicar/validar a versão compatível antes da 004.
```

A interface aceita somente nomes versionados como `008_nova_migracao.sql`, arquivos regulares dentro do catálogo deste commit e versões únicas consecutivas começando em 001. Caminhos absolutos/relativos, links simbólicos, duplicatas, lacunas e arquivo ausente falham antes de conectar. Cada migração é aplicada individualmente, nunca em lote automático até uma versão.

O runner usa o driver Neon já existente e uma única transação HTTP: timeout de lock, `pg_advisory_xact_lock`, criação/verificação de `public.schema_migrations`, SQL pendente e registro de SHA-256 são atômicos. A decisão é feita no servidor sob o lock; duas execuções concorrentes não reaplicam o SQL. Reexecutar o mesmo arquivo/checksum é no-op. Histórico com checksum/nome desconhecido, arquivo alterado, versão fora de ordem ou lacuna é recusado. Os arquivos aplicados são imutáveis; correções recebem uma nova versão.

SQL incompatível com transação, como `CREATE INDEX CONCURRENTLY`, não é suportado por este runner. Não acrescente escapes para executar comandos fora da transação: trate esse tipo de mudança em um processo específico revisado.

## Proteção especial da 004

A 003 mantém as colunas antigas durante a transição. **Antes da 004**, publique um commit que leia e grave `product_images` e valide cadastro, edição, ordenação e remoção de fotos, hero, destaques e vitrine nesse mesmo ambiente. Essa transição histórica exige uma versão compatível intermediária; o CD atual requer schema até 007 e não serve para bootstrap de uma versão anterior à 004.

Registre o SHA completo do commit efetivamente publicado e a evidência HTTPS dos testes (por exemplo, comentário de PR com URL da publicação e resultados). Um responsável configura `PRODUCT_IMAGES_VALIDATED_SHA` no GitHub Environment com esse SHA somente depois da inspeção. No workflow manual, a entrada `compatible_sha` deve coincidir com essa declaração protegida; `validation_reference` precisa ser HTTPS. O runner também exige esses dois argumentos ao aplicar 004 localmente:

```sh
node --env-file=.env.local scripts/migrate.mjs 004_remove_legacy_images.sql \
  --compatible-sha "<sha-completo-publicado-e-validado>" \
  --validation-reference "https://github.com/iweti/Debinatos/pull/<numero>#issuecomment-<id>"
```

A evidência fica em `schema_migrations.evidence`. Esses controles exigem uma declaração explícita e revisável; não detectam automaticamente se os testes manuais foram realmente executados. O SQL da própria 004 ainda verifica fotos e posições antes de remover colunas. Nunca marque um SHA como validado apenas porque seu build passou.

Depois da transição, aplique 005, preencha **preços reais** dos produtos existentes, valide-os e só então aplique 006. Aplique 007 antes de publicar o limitador administrativo. Não use o seed fictício de desenvolvimento em produção.

## Baseline de banco que já recebeu migrações

**Não reaplique 001–007 em um banco existente para criar o histórico.** Nomes/objetos presentes não provam que todos os efeitos e dados da migração foram aplicados. Um responsável deve conferir schema, constraints, índices, funções, dados migrados, ausência das colunas removidas na 004 e preços obrigatórios da 006, confrontando cada SQL com o banco real. Identifique o maior prefixo consecutivo comprovadamente aplicado e registre a inspeção em uma issue/PR sem credenciais ou dados pessoais. Havendo divergência, interrompa e corrija o plano em revisão antes de registrar qualquer baseline.

Somente após essa inspeção, e usando o mesmo commit auditado:

```sh
node --env-file=.env.local scripts/migrate.mjs \
  --baseline-through 007_admin_login_rate_limit.sql \
  --baseline-inspected \
  --inspection-reference "https://github.com/iweti/Debinatos/issues/<numero>#issuecomment-<id>"
node --env-file=.env.local scripts/migrate.mjs --verify-through 007_admin_login_rate_limit.sql
```

Substitua 007 pelo último arquivo realmente inspecionado, se o prefixo for menor. O baseline **não executa** os SQLs: registra nomes e checksums até a versão selecionada, com `method=baseline` e referência de inspeção. Faz verificações mínimas de tabelas, preço, função do limitador e remoção de colunas conforme a versão; isso não substitui a inspeção completa. Aceita somente o histórico 001–007; novas versões não podem ser simplesmente marcadas como aplicadas. É deliberadamente uma operação local/manual, indisponível no workflow de migração. Ausência de comprovação mantém o CD bloqueado.

## Disparo manual e recuperação

No GitHub, selecione **Migração manual**, a branch protegida, ambiente e nome exato de um arquivo do commit selecionado. A aprovação de produção revisa esse commit e argumentos. O job roda `check:env --context=migration` antes de conectar e usa a mesma trava do deploy. A 004 exige também os campos especiais acima. Não há migração automática em push ou deploy.

Se uma instrução falhar, PostgreSQL desfaz DDL/dados e registro da mesma transação; o workflow termina em erro e o histórico incompleto bloqueia o CD. Em erro de rede depois do envio, o cliente pode não saber se houve commit: consulte o histórico/checksum com `--verify-through` antes de agir. A reexecução do mesmo arquivo é segura e não repete um commit já registrado.

Mantenha backup/restore point antes de DDL destrutivo e valide recuperação em ambiente isolado. Depois de um commit SQL bem-sucedido, rollback de aplicação **não** desfaz schema; prefira migração corretiva aditiva em nova versão. Restaurar um banco para ponto anterior é uma operação separada, revisada, com análise de dados escritos após o ponto. Para rollback Vercel, escolha uma publicação compatível com o schema atual e confira a atribuição de domínios após a operação. Nunca apague linhas de `schema_migrations` nem edite checksums para forçar uma reaplicação.

## Evidência local e referências

Os testes unitários cobrem nomes, caminhos, catálogo futuro, links, versões e guardas 004/baseline. Os testes opt-in usam um PostgreSQL Docker descartável, criam bancos temporários e removem somente esses bancos; não leem URLs da aplicação:

```sh
LOGIN_RATE_LIMIT_TEST_CONTAINER="<container-postgres-local>" npx --no-install vitest run src/lib/__tests__/migration-runner-sql.test.ts
```

Eles verificam as SQLs reais 001–007, rollback de DDL e registro, baseline sem reaplicação, checksum, ordem/lacunas e duas execuções concorrentes. O contêiner precisa aceitar `psql -U postgres` localmente; sem essa variável, somente os testes PostgreSQL são pulados. O CI geral não recebe banco real. Validação de YAML e testes locais não comprovam os secrets/reviewers remotos nem uma publicação efetiva.

- [Vercel: configuração Git](https://vercel.com/docs/project-configuration/git-configuration)
- [Vercel CLI: deploy](https://vercel.com/docs/cli/deploy)
- [Vercel CLI: curl com proteção](https://vercel.com/docs/cli/curl)
- [Neon: transações HTTP não interativas](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#transaction-function)
- [GitHub: segurança de workflows](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
