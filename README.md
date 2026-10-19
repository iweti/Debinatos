# Debinatos

Catálogo de artesanatos, bijuterias e itens personalizados, feito com **Next.js 16 (App Router), TypeScript e Tailwind CSS 4**.

## Executar

O projeto usa **Node.js 24** e **npm 11**. O `.nvmrc` seleciona Node.js 24.21.0 para desenvolvimento local; a Vercel usa a versão 24.x disponível em seus builds e funções. As dependências têm versões exatas, e o `package-lock.json` fixa também as dependências indiretas.

Se você usa nvm, selecione a versão definida em `.nvmrc` antes de instalar:

```sh
nvm install
nvm use
```

Confira `node --version` e `npm --version`; devem ser versões 24.x e 11.x, respectivamente. Depois, instale pelo lockfile:

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Para testar a versão de produção:

```sh
npm run build
npm start
```

O `.npmrc` exige compatibilidade com as versões declaradas e salva novas dependências sem `^` ou `~`. O `devEngines` do `package.json` faz o npm conferir Node.js e npm antes de instalar ou executar os scripts. Essas configurações não alteram o Node.js global da máquina.

Use `npm ci` em novas instalações, na integração contínua e na publicação para reproduzir o lockfile. Atualizações devem ser explícitas: escolha uma versão com `npm install pacote@X.Y.Z`, revise as alterações em `package.json` e `package-lock.json` e execute `make validate` e `npm run build`. A seleção explícita de uma versão do Node.js deve ser refletida em `.nvmrc`, `engines` e `devEngines`.

O build usa a opção oficial `--webpack` para funcionar também em ambientes que restringem as portas internas do processamento de CSS do Turbopack. O servidor de desenvolvimento usa Turbopack.

## WhatsApp de contato

Copie `.env.example` para `.env.local` e preencha `WHATSAPP_PHONE` com o número da loja: código do país, DDD e número, apenas dígitos, sem `+`, espaços ou traços. Por exemplo, `5511999999999` ilustra o formato brasileiro. O arquivo `.env.local` não é versionado.

Na hospedagem, configure a mesma variável `WHATSAPP_PHONE` antes do build e publique novamente após alterá-la. No desenvolvimento, reinicie `npm run dev` depois de configurar. A variável é lida no servidor; não precisa do prefixo `NEXT_PUBLIC_`.

Os botões **Consultar pelo WhatsApp** em `/carrinho` e `/contato` abrem uma nova aba com os nomes e as quantidades dos produtos selecionados. Sem produtos no carrinho, `/contato` usa a mensagem “Olá! Gostaria de saber mais sobre pedidos personalizados.”.

Sem número configurado (ou com formato inválido), o botão permanece desativado com o aviso “WhatsApp em breve”. Produtos removidos, desativados ou com quantidade acima do estoque exigem revisão do carrinho antes da consulta. A mensagem é atualizada ao ajustar a seleção.

O contato não exige login, não envia a mensagem automaticamente, não esvazia o carrinho nem baixa estoque. Disponibilidade, entrega e demais detalhes são combinados diretamente com a Debinatos.

## Funcionalidades

- Catálogo com 12 produtos, busca, categorias e ordenação por destaques ou novidades, sem preços.
- Fotos, materiais, medidas, favoritos, carrinho de interesse e controle de estoque.
- Consulta pelo WhatsApp com os produtos e quantidades do carrinho.
- Perfil demonstrativo com edição de nome e endereço, opcional para o contato.
- Painel em `/admin` para cadastrar/editar produtos sem preço, adicionar até 5 fotos, alterar estoque e desativar itens.
- Restauração dos dados iniciais mediante confirmação no painel.

Os dados são locais; login e painel não têm autenticação real. O site não tem checkout, pagamento ou acompanhamento de pedidos. `/checkout` redireciona para `/carrinho` e `/pedido/[id]` para `/contato`. Links antigos para a aba de pedidos abrem os dados do perfil ou a visão geral do painel.

## Organização

```text
public/                             # Imagens, logo, mascote e fontes
src/
├── app/
│   ├── layout.tsx                  # Aviso, cabeçalho, conteúdo, rodapé e toast
│   ├── globals.css                 # Tailwind, tema e estilos globais
│   ├── providers.tsx               # Provider compartilhado da loja
│   ├── page.tsx                    # Rota /
│   ├── _components/                # Home, Hero e telas de erro
│   ├── _lib/                       # Lógica da página inicial
│   ├── catalogo/                   # /catalogo: Todos os produtos
│   │   ├── page.tsx
│   │   ├── _components/Catalog.tsx
│   │   └── _lib/use-catalog.ts
│   ├── carrinho/                   # page.tsx, _components e _lib
│   ├── favoritos/                  # page.tsx, _components e _lib
│   ├── produto/[id]/               # page.tsx, _components e _lib
│   ├── sobre/                      # page.tsx e _components
│   ├── contato/                    # /contato: personalizados e WhatsApp
│   ├── perfil/                     # page.tsx, _components e _lib
│   ├── checkout/                   # Redirecionamento para /carrinho
│   ├── pedido/[id]/                # Redirecionamento para /contato
│   └── admin/
│       ├── page.tsx
│       ├── _components/            # Admin, ProductEditor, StatsCard e Modal
│       └── _lib/                   # Hooks do painel e getStats
├── components/
│   ├── layout/                     # Header, Footer e DemoBanner
│   ├── providers/                  # StoreProvider
│   ├── account/                    # LoginPanel
│   ├── forms/                      # AddressFields
│   ├── contact/                    # Ação compartilhada de contato pelo WhatsApp
│   ├── product/                    # ProductCard e Photo
│   └── ui/                         # Botões auxiliares, estados e Toast
└── lib/                            # TypeScript compartilhado
    ├── domain/                     # Carrinho, mensagem de contato e validações
    ├── state/                      # Contexto, estado e ações da loja
    ├── storage/                    # localStorage e IndexedDB
    ├── data/                       # Dados iniciais da demonstração
    ├── types/                      # Tipos dos registros
    ├── constants/                  # Marca e local de retirada
    └── __tests__/                  # Testes das regras e do armazenamento
```

O projeto usa **colocation por rotas**: o nome de cada pasta em `src/app` corresponde à URL. Por exemplo, `src/app/carrinho/page.tsx` atende `/carrinho`; sua interface fica em `_components/Cart.tsx` e seu comportamento em `_lib/use-cart.ts`. A página inicial atende `/` e usa os diretórios privados da raiz de `app`. As pastas `[id]` recebem identificadores de produtos; a antiga rota de pedidos apenas redireciona.

As pastas com `_` ficam fora do roteamento. Crie `_components` e `_lib` apenas quando a página precisar deles. Componentes reutilizados ficam em `src/components`; hooks, tipos, regras e armazenamento compartilhados ficam em `src/lib`. O cabeçalho usa `src/components/layout/use-header.ts` para busca, menu móvel e contadores. `layout.tsx` compõe a estrutura da loja dentro do provider, e as páginas que dependem de parâmetros de busca mantêm suas fronteiras de `Suspense`.

Os componentes usam classes Tailwind diretamente no JSX, incluindo variações responsivas e estados de interação. `src/app/globals.css` é o único arquivo CSS e concentra fontes, tema, estilos base, acessibilidade e a animação de notificações. Padrões visuais reutilizados ficam nos próprios componentes React.

A navegação principal oferece **Início**, **Todos os produtos**, **Sobre a Debinatos** e **Contato**. Bijuterias, Acessórios e Decoração continuam como filtros de `/catalogo`, sem atalhos de categoria na página inicial, cabeçalho ou rodapé. Novas categorias de produtos ativos cadastrados no painel aparecem automaticamente nos filtros. Busca, categoria e ordenação usam os parâmetros `q`, `categoria` e `ordem`, preservando URLs filtradas. O parâmetro antigo `preco` é ignorado; `ordem=menor` e `ordem=maior` usam Destaques.

O perfil e `/admin` continuam demonstrativos, sem autenticação real.

Os registros atuais usam a chave `debinatos-demo-v2` no `localStorage`, sem preços ou pedidos; fotos adicionadas usam o banco `debinatos-photos` no IndexedDB. Limpar o navegador remove esses dados. Alterações são compartilhadas entre abas da mesma origem, mas não entre dispositivos.

Na primeira leitura sem dados v2, o site migra `debinatos-demo-v1`: aplica as migrações anteriores de catálogo e textos, preserva produtos personalizados, fotos, estoque, favoritos, carrinho e perfil, e grava a versão nova. O registro antigo é conservado sem alterações. Se a gravação falhar, os dados recuperados continuam disponíveis em memória com um aviso. Se v2 já existir, tem preferência sobre v1. A restauração do painel grava o catálogo inicial em v2.

Envio, retirada e prazos são combinados pelo WhatsApp; não há cálculo de frete ou consulta de CEP no carrinho.

## Verificação

```sh
npx next typegen
npm run typecheck
npm run lint
npm test
npm run build
```

Os testes cobrem a mensagem e a codificação do link do WhatsApp, seleção vazia ou indisponível, quantidades, estoque, migração v1 para v2, persistência, dados corrompidos, falha de gravação e fotos em IndexedDB.

`npm run format` aplica o estilo de `.prettierrc.json`. O `.prettierignore` exclui JSON, arquivos gerados, dependências, saídas de build, `public` e os demais caminhos ignorados. A configuração JSON continua sendo lida, mas arquivos JSON não são reformatados.

`npm run lint` verifica os arquivos TypeScript/TSX de `src`: regras recomendadas de JavaScript/TypeScript e acessibilidade, imports sem uso, ordenação de imports/exports e classes canônicas do Tailwind. `npm run lint:fix` organiza os imports e aplica as correções automáticas disponíveis; depois execute `npm run format` para padronizar a apresentação. Avisos exigem revisão, mas não interrompem a validação; erros interrompem.

As regras reproduzem as intenções do exemplo do Biome, sem equivalência completa entre os conjuntos recomendados. `any` é permitido; variáveis, imports e parâmetros sem uso geram avisos. Acessibilidade usa `@htmlacademy/eslint-plugin-jsx-a11y`, fork com suporte declarado ao ESLint 10, inicialmente com avisos para revisão dos componentes existentes. SVGs devem ter título ou nome acessível, ou ser marcados como decorativos. Não há análise de CSS nem a regra de optional chaining que exige informações de tipos.

`make lint` formata, executa o ESLint e verifica tipos, nessa ordem. `make validate` também executa os testes. A organização de imports ocorre com `npm run lint:fix`; não depende de configuração do editor.

Referências visuais originais: [ZIP da Debinatos](<WhatsApp Unknown 2026-10-10 at 17.43.03.zip>). Veja [ASSETS.md](ASSETS.md) para a origem das imagens ilustrativas e fontes.

Publicação comercial, autenticação e backend ficam fora desta implementação. O contato e a combinação dos detalhes acontecem pelo WhatsApp.
