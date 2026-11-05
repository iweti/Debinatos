# Debinatos

Catálogo online de artesanatos, bijuterias e itens personalizados. O visitante explora os produtos, salva favoritos e monta um carrinho para combinar a compra pelo WhatsApp. O painel administrativo permite gerenciar produtos, fotos e destaques da loja.

## Funcionalidades

- Catálogo com busca, categorias, destaques e ordenação por novidades.
- Página de produto com fotos e preço em reais.
- Favoritos e carrinho salvos no navegador, sem cadastro de cliente.
- Contato pelo WhatsApp com os nomes e quantidades do carrinho.
- Painel em `/admin` com login, cadastro e edição de produtos, controle de visibilidade e organização dos destaques.

A compra é combinada na conversa: o site não processa pagamentos, não registra pedidos e não baixa estoque automaticamente.

## Tecnologias

Next.js 16, React 19, TypeScript e Tailwind CSS 4. Os dados ficam no PostgreSQL (Neon), as imagens no Cloudinary e a publicação usa Vercel.

## Como executar

Você precisa de **Node.js 24**, **npm 11**, um banco PostgreSQL no Neon e uma conta Cloudinary. A versão do Node está em [.nvmrc](.nvmrc).

1. Instale as dependências. Se usa nvm:

   ```sh
   nvm install
   nvm use
   npm ci
   ```

2. Copie o exemplo de configuração:

   ```sh
   cp .env.example .env.local
   ```

3. Preencha `.env.local` com as credenciais dos serviços:

   | Variável | Finalidade |
   | --- | --- |
   | `DATABASE_URL` | Conexão da aplicação com o PostgreSQL. |
   | `SESSION_SECRET` | Segredo aleatório de pelo menos 32 bytes para as sessões administrativas. |
   | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Credenciais de upload de imagens. |
   | `CLOUDINARY_FOLDER` | Opcional; pasta das imagens, com padrão `debinatos`. |
   | `WHATSAPP_PHONE` | Opcional; país + DDD + número, apenas dígitos (12–13). Sem ele, o contato por WhatsApp fica desativado. |

   As credenciais são exclusivas do servidor. Não versione `.env.local`. As variáveis adicionais para migração e validação estão descritas em [.env.example](.env.example).

4. Prepare o banco com os arquivos SQL de `migrations/` e o executor `scripts/migrate.mjs`, respeitando a ordem e as condições de cada migração. As migrações são manuais e não rodam ao iniciar o site. O catálogo começa vazio, sem produtos de demonstração.

5. Valide a configuração e inicie o servidor:

   ```sh
   NODE_ENV=development node --env-file=.env.local scripts/check-env.mjs
   npm run dev
   ```

Acesse [localhost:3000](http://localhost:3000). Reinicie o servidor após alterar as variáveis de ambiente.

## Acesso administrativo

Abra `/admin` ou o link **Painel administrativo** no rodapé. O proprietário deve criar a conta diretamente na tabela `admin_users`, com senha armazenada como hash bcrypt. Não há usuário padrão nem cadastro público.

No painel, cadastre os produtos, envie até cinco fotos por produto e configure os destaques da página inicial.

## Comandos úteis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o desenvolvimento local. |
| `npx next typegen` | Gera os tipos de rotas antes da primeira verificação. |
| `make check` | Verifica formatação, lint e tipos, sem alterar arquivos. |
| `make test` | Executa os testes automatizados. |
| `make fix` | Aplica correções de lint e formatação. |
| `npm run build` | Gera a versão de produção. |
| `npm start` | Executa a versão de produção após o build. |

Antes de enviar alterações, execute `npx next typegen`, `make check`, `make test` e `npm run build`. O CI também verifica vulnerabilidades das dependências de produção. Login, uploads e conexão com os serviços precisam de validação no ambiente configurado.

## Testes de integração com PostgreSQL

O CI inicia um PostgreSQL 17 descartável e executa também os testes SQL de migrações e do limitador de login. Falhas ao iniciar ou acessar esse banco interrompem a validação.

Para executar a mesma suíte localmente com Docker:

```sh
docker run --detach --rm --name debinatos-tests --env POSTGRES_HOST_AUTH_METHOD=trust postgres:17-alpine
# Aguarde este comando indicar que o PostgreSQL está aceitando conexões:
docker exec debinatos-tests pg_isready -U postgres
LOGIN_RATE_LIMIT_TEST_CONTAINER=debinatos-tests npm test
docker stop debinatos-tests
```

O contêiner não publica portas e não usa as credenciais da aplicação. Sem `LOGIN_RATE_LIMIT_TEST_CONTAINER`, os 13 testes de integração são ignorados na execução local.

## Publicação

A publicação usa o projeto **debinatos** na Vercel, com deploys automáticos pela integração Git habilitados em [vercel.json](vercel.json). A Vercel define o destino das branches e os domínios. Esses deploys não aguardam o CI nem aplicam migrações automaticamente. O [CD opcional](.github/workflows/deploy.yml) e o [workflow manual de migrações](.github/workflows/migrate.yml) dependem de variáveis explícitas de habilitação; evite habilitar dois fluxos de publicação ao mesmo tempo.

Referências das imagens utilizadas: [Recursos visuais](ASSETS.md).
