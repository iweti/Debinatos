# Debinatos

Catálogo de artesanatos, bijuterias e itens personalizados, com Next.js 16, React, TypeScript, Tailwind CSS 4, PostgreSQL no Neon e imagens no Cloudinary.

## Desenvolvimento

O projeto usa Node.js 24 e npm 11. O `.nvmrc` fixa a versão local. Com nvm:

```sh
nvm install
nvm use
npm ci
```

Copie `.env.example` para `.env.local`, preencha as variáveis e execute:

```sh
npm run dev
```

Abra http://localhost:3000. Para executar a versão de produção:

```sh
npm run build
npm start
```

As dependências têm versões exatas em `package.json` e dependências indiretas registradas em `package-lock.json`. Use `npm ci` para reproduzir a instalação. Atualizações são explícitas e devem ser seguidas das verificações abaixo. O build usa Webpack para funcionar também em ambientes que restringem portas internas do Turbopack.

## Banco e migrações

A aplicação usa SQL parametrizado com `@neondatabase/serverless`, sem ORM. `DATABASE_URL` é a conexão da aplicação; `DATABASE_URL_UNPOOLED` deve usar o host direto, sem `-pooler`, para migrações. Os módulos de banco, sessão e Cloudinary são marcados com `server-only`.

Aplique uma única vez, na ordem, os arquivos SQL versionados:

1. `migrations/001_admin_users.sql`: extensão `pgcrypto`, tabela de administradores e índice único de e-mail sem diferenciar maiúsculas/minúsculas.
2. `migrations/002_products.sql`: tabela de produtos, validação de quantidade e lista de imagens.
3. `migrations/003_product_images_highlights.sql`: converte as URLs para `product_images`, preserva a ordem dos destaques e vincula o hero aos IDs das fotos. Reconcilia também o schema parcialmente implementado no `dev`.
4. `migrations/004_remove_legacy_images.sql`: remove `products.img` e `hero_products.image_url`, somente após publicar e validar a aplicação que usa `product_images`.
5. `migrations/005_product_prices.sql`: adiciona `price_cents` e atualiza a gravação atômica para exigir preço positivo em centavos.
6. `migrations/006_require_product_prices.sql`: torna o preço obrigatório no banco, após preencher os produtos existentes.
7. `migrations/007_admin_login_rate_limit.sql`: cria limites compartilhados de tentativas do login administrativo; aplique antes de publicar o limitador.

As migrações não criam usuários nem produtos e não são executadas automaticamente no build ou na inicialização. O catálogo começa vazio. Aplique e valide primeiro em uma branch de desenvolvimento, usando conexão direta; depois aplique os mesmos arquivos na branch de produção antes de publicar a aplicação.

Nesta implementação, `.neon` e as conexões locais apontam para a branch `dev` do projeto existente. A branch é temporária: confira sua expiração no Neon antes de reutilizá-la. A branch `production` não foi alterada por esta implementação. `.neon` e `.env.local` não são versionados.

A tabela `products` contém os dados do produto e `featured`/`featured_order`, que devem permanecer sincronizados. As fotos ficam em `product_images` (`id`, `product_id`, `url`, `position`), com posição única por produto. `Product.images` contém objetos `{ id, url, position }` ordenados; a primeira foto é a capa. Quantidades são inteiras e não negativas.

O contrato de `Product` e `ProductInput` inclui `priceCents`: inteiro de 1 a 2.147.483.647, correspondente a `products.price_cents`. A Server Action `saveProduct` valida esse campo antes de acessar o banco; `save_store_product` exige o mesmo campo no JSON tanto na criação quanto na edição. O formulário aceita reais com vírgula ou ponto, com no máximo duas casas decimais. Cards, detalhes, painel e carrinho exibem os valores em reais. Os totais usam `bigint` em centavos para preservar a precisão mesmo com grandes quantidades, sem alterar a mensagem do WhatsApp.

Na branch `dev`, aplique a migração 005, preencha os preços e depois aplique a 006. Para os valores fictícios autorizados (R$ 19,90, R$ 29,90 e R$ 49,90), use `node --env-file=.env.local scripts/seed-dev-prices.mjs`. O script confere projeto, branch e endpoint e preenche somente preços ausentes, incluindo produtos inativos. Ele não faz parte das migrações de produção. Valide com `node --env-file=.env.local scripts/validate-prices.mjs`: os testes SQL são revertidos e a reexecução do preenchimento não altera preços existentes. Em produção, preencha preços reais entre as migrações 005 e 006 antes de publicar a aplicação; esta alteração foi aplicada somente na `dev`.

O carrinho armazena apenas IDs e quantidades. Produtos ausentes ou desativados são removidos ao recuperar os dados locais, atualizar o catálogo ou sincronizar outra aba; favoritos e produtos ativos sem estoque são preservados. Falhas ao carregar o catálogo não provocam limpeza. Se a persistência local falhar, a limpeza permanece na tela e um aviso informa que não foi possível salvá-la.

`hero_products` contém as posições `primary` e `secondary`, com `product_id` e `image_id`. A chave estrangeira composta impede escolher uma foto de outro produto. Remover uma foto limpa apenas `image_id`, mantendo o produto para usar sua primeira foto disponível. Limpar a seleção remove ambas as referências; produto desativado usa a foto padrão. As duas posições podem usar fotos do mesmo produto.

Para aplicar uma migração pela conexão direta configurada:

```sh
node --env-file=.env.local scripts/migrate.mjs 003_product_images_highlights.sql
```

Não reaplique arquivos já executados. Em produção, confirme as migrações de base, aplique `003`, publique a aplicação compatível e valide antes de aplicar `004`. Durante a troca, evite gravações administrativas pela versão antiga. As funções de salvamento não usam as colunas legadas; elas podem ser removidas sem outra publicação de código.

Para validar os schemas original e atual com uma cópia dos produtos e configurações do `dev`, defina `VALIDATION_DATABASE_URL` com a conexão direta de uma branch temporária separada e execute:

```sh
node --env-file=.env.local --env-file=/caminho/validation.env scripts/validate-highlights.mjs
```

O script cria schemas isolados nessa branch, sem copiar administradores, e testa migração, preservação, IDs estáveis, vínculos, reordenação, remoção, desativação, concorrência e rollback. Use expiração na branch temporária. Branches Neon com expiração não aceitam filhas; nesse caso, crie a branch de validação a partir de um ancestral sem expiração.

## Acesso administrativo

O acesso pela navegação da loja fica exclusivamente no link **Painel administrativo** do rodapé, que abre `/admin`. Sem sessão válida, a navegação segue para `/admin/login`, que pede e-mail e senha. Após entrar, o painel permite cadastrar e editar produtos, ativá-los ou desativá-los e configurar **Produtos em destaque** em `/admin?aba=destaques`.

A aba de destaques reúne a galeria com todas as fotos dos produtos ativos e a lista ordenada de Favoritos da Debinatos. As seleções do hero são independentes dos favoritos. Alterações ficam em rascunho entre as abas e são publicadas juntas por **Salvar alterações**, com autenticação e validação no servidor. Falhas preservam o rascunho para nova tentativa. Produtos desativados continuam configurados e sinalizados no painel.

Produto e suas fotos são salvos em uma transação separada da configuração dos destaques. IDs de fotos existentes são preservados; novas fotos recebem IDs do banco. O cadastro comum não altera `featured` nem `featured_order`. As gravações administrativas usam um advisory lock transacional compartilhado para serializar alterações relacionadas.

**As credenciais devem ser criadas e alteradas exclusivamente pelo proprietário, diretamente no banco**, por exemplo pelo SQL Editor do Neon. A tabela é `admin_users`:

- `id`: UUID gerado automaticamente.
- `email`: obrigatório, sem espaços nas extremidades e único, ignorando maiúsculas/minúsculas.
- `password_hash`: hash bcrypt gerado no próprio PostgreSQL com as funções `crypt` e `gen_salt` do `pgcrypto`, usando o algoritmo `bf` e custo recomendado 12. Nunca grave a senha em texto simples. O limite do bcrypt é de 72 bytes UTF-8, incluindo senhas com acentos.

Todos os registros dessa tabela têm acesso administrativo ao catálogo inteiro. O projeto não oferece cadastro, listagem de usuários, recuperação de senha, contas iniciais ou scripts de criação de usuários.

Configure `SESSION_SECRET` com um valor aleatório de pelo menos 32 bytes, exclusivo do servidor e igual entre instâncias de um mesmo ambiente. A sessão assinada com `jose` expira em 24 horas fixas, em cookie `HttpOnly`, `SameSite=Lax` e `Secure` em produção. Configure HTTPS na publicação. A existência do usuário é conferida no banco ao acessar o painel e executar operações protegidas. Excluir o usuário invalida seu acesso; trocar sua senha não encerra automaticamente uma sessão já emitida. Trocar o segredo invalida todas as sessões do ambiente. Sair remove o cookie do navegador.

O login admite cinco tentativas por conta e trinta por origem em quinze minutos, com reservas atômicas no PostgreSQL antes da verificação da senha. Aplique a migração `007_admin_login_rate_limit.sql` antes de publicar esta versão. Confira [limites, identificação confiável de origem, retenção e testes](docs/admin-login-rate-limit.md).

A proteção acontece no servidor, tanto na página quanto nas Server Actions; dados do navegador não concedem acesso. Erros de banco ou autenticação não restauram o modo demonstrativo. Sem uma conta criada manualmente pelo proprietário, o login de sucesso e as operações autenticadas ficam pendentes de validação.

## Fotos no Cloudinary

Preencha `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` e `CLOUDINARY_FOLDER` no servidor. A pasta padrão é `debinatos`.

O administrador seleciona de uma a cinco fotos JPG, PNG ou WebP, de até 5 MB cada. A primeira é a capa. O servidor valida a sessão e assina os parâmetros de upload com o SDK oficial; o navegador envia os arquivos diretamente ao Cloudinary, sem passar o conteúdo das fotos pelas Server Actions. O segredo da API permanece no servidor.

O produto salva apenas URLs HTTPS de imagens da conta configurada. O formulário bloqueia o salvamento durante uploads e em caso de falha, até o envio ser refeito com sucesso. Durante o salvamento, os campos ficam desativados. O seletor de posição permite reorganizar as fotos mantendo seus IDs. Remover uma foto exclui somente seu registro no banco: a exclusão física dos arquivos, inclusive de envios cancelados ou parcialmente concluídos, é manual no Cloudinary nesta etapa.

## Catálogo e dados do visitante

Início, catálogo, detalhes, favoritos e carrinho usam os produtos ativos do banco. O painel também mostra os desativados. Busca, categorias, destaques e ordenação por novidades continuam disponíveis. Mudanças no admin atualizam o painel e invalidam a vitrine; outras visitas ou recarregamentos recebem o catálogo atualizado.

A home exibe todos os favoritos ativos por `featured_order`: até quatro em grade e, a partir de cinco, em um carrossel contínuo sem reprodução automática. Em **Destaques**, o catálogo mostra todos os favoritos nessa sequência e depois os demais por data decrescente; busca e categorias preservam essa ordem. **Novidades** considera exclusivamente a data. ID desempata datas iguais. Favoritos pessoais do visitante permanecem independentes dessa configuração.

Somente carrinho e favoritos ficam no `localStorage`, na chave `debinatos-visitor-v1`, com sincronização entre abas. Na primeira leitura, são recuperados os campos correspondentes de `debinatos-demo-v2` ou `debinatos-demo-v1`, sem importar catálogo, perfil ou login antigo. As chaves antigas são preservadas; a recuperação lê somente carrinho e favoritos, sem os utilitários antigos de demonstração.

Não há perfil de cliente ou login demonstrativo. `/perfil` redireciona para `/`. Também não há checkout, pagamentos ou pedidos persistidos: `/checkout` redireciona para `/carrinho` e `/pedido/[id]` para `/contato`.

O catálogo vazio é exibido sem produtos fictícios. Falhas de conexão apresentam uma mensagem com opção de tentar novamente.

## WhatsApp

Configure `WHATSAPP_PHONE` com código do país, DDD e número, apenas dígitos. Sem configuração válida, o botão fica desativado com o aviso “WhatsApp em breve”. Reinicie o desenvolvimento ou publique novamente após alterar a variável, que é lida no servidor.

Os botões de contato abrem uma nova aba com nomes e quantidades do carrinho. A quantidade cadastrada no banco permanece como informação interna: não limita o carrinho, mesmo quando é zero. Produtos removidos ou desativados e quantidades inválidas exigem revisão. O contato não exige login, não envia a mensagem automaticamente, não esvazia o carrinho e não baixa estoque. Disponibilidade, envio, retirada e demais detalhes são confirmados na conversa pelo WhatsApp.

## Organização e validação

As rotas ficam em `src/app`, com componentes e lógica específicos em `_components` e `_lib`. Componentes reutilizados ficam em `src/components`. Acesso ao banco e serviços externos ficam em `src/lib/server`; regras de carrinho e contato em `src/lib/domain`.

```sh
npx next typegen
make check
make test
npm run build
```

Nenhum arquivo novo de teste faz parte desta etapa. A suíte existente cobre carrinho, contato e persistência local de carrinho e favoritos. Confira manualmente login válido/inválido, expiração, logout, bloqueio de operações sem sessão, cadastro/edição/visibilidade, falhas de upload e catálogo vazio. Para sucesso autenticado, use uma conta criada manualmente pelo proprietário no banco.

`make check` verifica formatação, lint e tipos sem corrigir os arquivos. A verificação de formatação também pode ser executada isoladamente com `npm run format:check`: ela usa os mesmos caminhos de `npm run format`, retorna erro quando encontra divergências e não reescreve o código. Gere os tipos de rota com `npx next typegen` antes da primeira verificação em um checkout novo.

Para corrigir arquivos explicitamente, use `npm run lint:fix` (organização de imports e correções do ESLint), `npm run format` (Prettier) ou `make fix` (ambos). Depois rode `make check` novamente. `make lint` continua disponível como alias de `make check`, agora sem correções automáticas; `make validate` executa `make check` e os testes. As verificações de CI podem reutilizar `make check`.

Referências dos recursos visuais: [ASSETS.md](ASSETS.md).
