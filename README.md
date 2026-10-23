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

As migrações não criam usuários nem produtos e não são executadas automaticamente no build ou na inicialização. O catálogo começa vazio. Aplique e valide primeiro em uma branch de desenvolvimento, usando conexão direta; depois aplique os mesmos arquivos na branch de produção antes de publicar a aplicação.

Nesta implementação, `.neon` e as conexões locais apontam para a branch `dev` do projeto existente. Ela foi configurada no Neon para expirar em **23/10/2026 às 20h23, horário de Brasília**. A branch `production` não recebeu as migrações. `.neon` e `.env.local` não são versionados. Antes de usar um ambiente depois dessa data, configure uma branch existente e confira seu esquema.

A tabela `products` contém ID UUID, nome, descrição, quantidade, data de adição, categoria, material, medidas, visibilidade, destaque, selo opcional e `img` (`text[]`). ID e data são gerados pelo banco e preservados nas edições. `img` é convertido em `Product.images` na leitura pelo servidor. Quantidades são inteiras e não negativas.

## Acesso administrativo

O acesso pela navegação da loja fica exclusivamente no link **Painel administrativo** do rodapé, que abre `/admin`. Sem sessão válida, a navegação segue para `/admin/login`, que pede e-mail e senha. Após entrar, o painel permite cadastrar e editar produtos, ativá-los ou desativá-los e sair.

**As credenciais devem ser criadas e alteradas exclusivamente pelo proprietário, diretamente no banco**, por exemplo pelo SQL Editor do Neon. A tabela é `admin_users`:

- `id`: UUID gerado automaticamente.
- `email`: obrigatório, sem espaços nas extremidades e único, ignorando maiúsculas/minúsculas.
- `password_hash`: hash bcrypt gerado no próprio PostgreSQL com as funções `crypt` e `gen_salt` do `pgcrypto`, usando o algoritmo `bf` e custo recomendado 12. Nunca grave a senha em texto simples. O limite do bcrypt é de 72 bytes UTF-8, incluindo senhas com acentos.

Todos os registros dessa tabela têm acesso administrativo ao catálogo inteiro. O projeto não oferece cadastro, listagem de usuários, recuperação de senha, contas iniciais ou scripts de criação de usuários.

Configure `SESSION_SECRET` com um valor aleatório de pelo menos 32 bytes, exclusivo do servidor e igual entre instâncias de um mesmo ambiente. A sessão assinada com `jose` expira em 24 horas fixas, em cookie `HttpOnly`, `SameSite=Lax` e `Secure` em produção. Configure HTTPS na publicação. A existência do usuário é conferida no banco ao acessar o painel e executar operações protegidas. Excluir o usuário invalida seu acesso; trocar sua senha não encerra automaticamente uma sessão já emitida. Trocar o segredo invalida todas as sessões do ambiente. Sair remove o cookie do navegador.

A proteção acontece no servidor, tanto na página quanto nas Server Actions; dados do navegador não concedem acesso. Erros de banco ou autenticação não restauram o modo demonstrativo. Sem uma conta criada manualmente pelo proprietário, o login de sucesso e as operações autenticadas ficam pendentes de validação.

## Fotos no Cloudinary

Preencha `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` e `CLOUDINARY_FOLDER` no servidor. A pasta padrão é `debinatos`.

O administrador seleciona de uma a cinco fotos JPG, PNG ou WebP, de até 5 MB cada. A primeira é a capa. O servidor valida a sessão e assina os parâmetros de upload com o SDK oficial; o navegador envia os arquivos diretamente ao Cloudinary, sem passar o conteúdo das fotos pelas Server Actions. O segredo da API permanece no servidor.

O produto salva apenas URLs HTTPS de imagens da conta configurada. O formulário bloqueia o salvamento durante uploads e em caso de falha, até o envio ser refeito com sucesso. Durante o salvamento, os campos ficam desativados. Remover uma foto do produto retira apenas sua URL: a exclusão física de fotos, inclusive de envios cancelados ou parcialmente concluídos, é manual no Cloudinary nesta etapa.

## Catálogo e dados do visitante

Início, catálogo, detalhes, favoritos e carrinho usam os produtos ativos do banco. O painel também mostra os desativados. Busca, categorias, destaques e ordenação por novidades continuam disponíveis. Mudanças no admin atualizam o painel e invalidam a vitrine; outras visitas ou recarregamentos recebem o catálogo atualizado.

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
npm run typecheck
npm run lint
npm test
npm run build
```

Nenhum arquivo novo de teste faz parte desta etapa. A suíte existente cobre carrinho, contato e persistência local de carrinho e favoritos. Confira manualmente login válido/inválido, expiração, logout, bloqueio de operações sem sessão, cadastro/edição/visibilidade, falhas de upload e catálogo vazio. Para sucesso autenticado, use uma conta criada manualmente pelo proprietário no banco.

`npm run lint:fix` organiza imports e aplica correções automáticas; `npm run format` aplica Prettier. `make lint` também formata e verifica tipos; `make validate` acrescenta os testes.

Referências dos recursos visuais: [ASSETS.md](ASSETS.md).
