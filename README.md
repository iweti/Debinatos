# Debinatos

Protótipo de loja virtual de artesanatos, bijuterias e itens personalizados, feito com **Next.js 16 (App Router), TypeScript e Tailwind CSS 4**.

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

A página `/contato` apresenta os pedidos personalizados. Com o número preenchido, o botão abre o WhatsApp em nova aba com a mensagem “Olá! Gostaria de saber mais sobre pedidos personalizados.”. Sem número, o botão permanece desativado com o aviso “WhatsApp em breve”.

## Funcionalidades

- Catálogo com 12 produtos fictícios, busca, categorias, filtro de preço e ordenação.
- Fotos, materiais, medidas, favoritos, carrinho e controle de estoque.
- Checkout com perfil demonstrativo, envio por CEP ou retirada, Pix ou cartão ilustrativos.
- Perfil com edição de nome/endereço, histórico, detalhes e andamento dos pedidos.
- Painel em `/admin` para cadastrar/editar produtos, adicionar até 5 fotos, alterar estoque, desativar itens e atualizar pedidos.
- Restauração da demonstração mediante confirmação no painel.
- Contato para pedidos personalizados pelo WhatsApp, com número configurável.

Todas as operações são locais. O checkout não cobra, não solicita dados bancários e não gera entregas. O login e o painel não têm autenticação real. Use informações fictícias. A demonstração inclui um pedido inicial concluído.

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
│   ├── checkout/                   # page.tsx, _components e _lib
│   ├── pedido/[id]/                # page.tsx, _components e _lib
│   └── admin/
│       ├── page.tsx
│       ├── _components/            # Admin, ProductEditor, StatsCard e Modal
│       └── _lib/                   # Hooks do painel e getStats
├── components/
│   ├── layout/                     # Header, Footer e DemoBanner
│   ├── providers/                  # StoreProvider
│   ├── account/                    # LoginPanel
│   ├── forms/                      # AddressFields
│   ├── orders/                     # StatusBadge
│   ├── product/                    # ProductCard e Photo
│   └── ui/                         # Botões auxiliares, estados e Toast
└── lib/                            # TypeScript compartilhado
    ├── domain/                     # Carrinho, pedidos e validações
    ├── state/                      # Contexto, estado e ações da loja
    ├── storage/                    # localStorage e IndexedDB
    ├── hooks/                      # Cabeçalho, login e componentes de produto
    ├── data/                       # Dados iniciais da demonstração
    ├── types/                      # Tipos dos registros
    ├── constants/                  # Marca, frete, retirada e andamentos
    ├── utils/                      # Formatação de dinheiro e datas
    └── __tests__/                  # Testes das regras e do armazenamento
```

O projeto usa **colocation por rotas**: o nome de cada pasta em `src/app` corresponde à URL. Por exemplo, `src/app/carrinho/page.tsx` atende `/carrinho`; sua interface fica em `_components/Cart.tsx` e seu comportamento em `_lib/use-cart.ts`. A página inicial atende `/` e usa os diretórios privados da raiz de `app`. As pastas `[id]` recebem identificadores de produtos e pedidos.

As pastas com `_` ficam fora do roteamento. Crie `_components` e `_lib` apenas quando a página precisar deles. Componentes reutilizados ficam em `src/components`; hooks, tipos, regras e armazenamento compartilhados ficam em `src/lib`. O cabeçalho usa `src/lib/hooks/use-header.ts` para busca, menu móvel e contadores. `layout.tsx` compõe a estrutura da loja dentro do provider, e as páginas que dependem de parâmetros de busca mantêm suas fronteiras de `Suspense`.

Os componentes usam classes Tailwind diretamente no JSX, incluindo variações responsivas e estados de interação. `src/app/globals.css` é o único arquivo CSS e concentra fontes, tema, estilos base, acessibilidade e a animação de notificações. Padrões visuais reutilizados ficam nos próprios componentes React.

A navegação principal oferece **Início**, **Todos os produtos**, **Sobre a Debinatos** e **Contato**. Bijuterias, Acessórios e Decoração continuam como filtros de `/catalogo`, sem atalhos de categoria na página inicial, cabeçalho ou rodapé. Novas categorias de produtos ativos cadastrados no painel aparecem automaticamente nos filtros. Busca, categoria, preço e ordenação usam os parâmetros `q`, `categoria`, `preco` e `ordem`, preservando URLs filtradas.

O perfil, o checkout e `/admin` continuam demonstrativos, sem autenticação real.

Os registros usam a chave `debinatos-demo-v1` no `localStorage`; fotos adicionadas usam o banco `debinatos-photos` no IndexedDB. Limpar o navegador remove esses dados. Alterações são compartilhadas entre abas da mesma origem, mas não entre dispositivos. Os pedidos guardam cópias dos nomes, preços e endereço da compra.

O envio custa R$ 14,90, com prazo ilustrativo de 5 a 8 dias úteis; retirada gratuita em endereço fictício. Não há consulta de CEP ou transportadoras.

## Verificação

```sh
npx next typegen
npm run typecheck
npm test
npm run build
```

Os testes cobrem totais, estoque, indisponibilidade, histórico, persistência, dados corrompidos, falha de gravação e fotos em IndexedDB. `npm run format` formata o código.

Referências visuais originais: [ZIP da Debinatos](<WhatsApp Unknown 2026-10-10 at 17.43.03.zip>). Veja [ASSETS.md](ASSETS.md) para a origem das imagens ilustrativas e fontes.

Publicação comercial, autenticação, backend, pagamentos reais e frete integrado ficam para a próxima etapa.
