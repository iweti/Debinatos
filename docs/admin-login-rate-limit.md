# Limite de tentativas do login administrativo

A Server Action de login reserva uma tentativa no PostgreSQL **antes** de consultar `crypt`. A migração [007](../migrations/007_admin_login_rate_limit.sql) cria o estado compartilhado entre instâncias e a função `consume_admin_login_attempt`. Não há contador apenas em memória nem serviço adicional.

Cada janela fixa de quinze minutos admite cinco tentativas por e-mail e trinta por origem. Ambos os limites precisam permitir a reserva. Contam tentativas com campos sintaticamente válidos, incluindo acertos, erros e falhas posteriores de autenticação. Contas inexistentes recebem a mesma política. Bloqueios não prorrogam a janela; após a expiração, a próxima tentativa inicia outra janela. Um ataque contínuo ainda pode consumir cada nova janela, mas não cria um bloqueio permanente no banco.

As reservas são atômicas com `INSERT ... ON CONFLICT DO UPDATE`. As duas chaves são processadas sempre na mesma ordem, e a transação da função termina antes da consulta da senha. Requisições simultâneas e instâncias diferentes disputam os mesmos registros; o limite não depende da fila de ações do navegador. Contadores saturam em limite + 1, evitando crescimento numérico ilimitado durante um bloqueio.

Senha incorreta e limite atingido retornam a mesma mensagem: “Não foi possível entrar. Confira os dados ou aguarde 15 minutos antes de tentar novamente.” Sem migração, segredo adequado ou banco disponível, a ação recusa o login sem consultar `crypt`. Nenhuma sessão é criada nessa condição. O acesso já autenticado continua usando a sessão existente.

## Identificação da origem e privacidade

Na Vercel, com a variável de plataforma `VERCEL=1`, somente um IP válido em `x-vercel-forwarded-for` identifica a origem. IPv6 é canonicalizado. A [documentação de headers da Vercel](https://vercel.com/docs/headers/request-headers) descreve os headers definidos pelo ingresso e a proteção contra falsificação. Não configure `VERCEL=1` manualmente em uma instalação própria.

Fora da Vercel ou sem um valor válido, todas as requisições usam um bucket conservador de origem desconhecida. Headers arbitrários como `x-forwarded-for`, `x-real-ip` e listas de IPs são ignorados. Isso preserva o limite mesmo quando o cliente forja headers. Em uma instalação própria ou atrás de um proxy que agrupe visitantes, diferentes administradores podem compartilhar o limite de trinta tentativas. Adotar outro proxy confiável exige uma integração explícita que garanta a sobrescrita e a origem do header; adicionar apenas um nome de header à configuração não basta.

A tabela contém HMAC-SHA256 de e-mail normalizado e origem, contadores e expiração, sem e-mail/IP em texto simples e sem senha. O HMAC usa o `SESSION_SECRET` já existente, com separação por finalidade. Todas as instâncias do ambiente precisam usar o mesmo segredo. Trocá-lo invalida as sessões e muda as chaves dos contadores. O limite não elimina a necessidade de proteção contra tráfego abusivo na hospedagem: requisições bloqueadas ainda acessam o banco para conferir a reserva.

Cada chamada remove até cem chaves vencidas há mais de um dia, usando o índice de expiração e `FOR UPDATE SKIP LOCKED`. Essa limpeza não espera por outras reservas. Ambientes sem novas tentativas retêm os hashes expirados até o próximo uso. Os registros novos não estendem a retenção dos antigos.

## Implantação

1. Validar a migração em uma branch de banco isolada usando conexão direta.
2. Aplicar a migração `007_admin_login_rate_limit.sql` no banco do ambiente **antes** de publicar o código que depende dela, usando o fluxo de migrações do projeto.
3. Publicar todas as instâncias com o mesmo `SESSION_SECRET` e conferir o caminho de login no ambiente.

A tabela e a função não concedem acesso a `PUBLIC`. O usuário do banco que aplica as migrações e executa a aplicação é o proprietário no fluxo atual. Se forem usados papéis distintos, o papel da aplicação precisa de `EXECUTE` na função e `SELECT`, `INSERT`, `UPDATE`, `DELETE` na tabela. A função usa os privilégios do chamador e não é `SECURITY DEFINER`.

Nenhum banco real foi alterado nesta correção. A implantação e o teste com uma credencial real são responsabilidades do fluxo de publicação. Não remova a migração durante um rollback enquanto alguma instância ainda usar o limitador.

## Verificação reproduzível

Os testes unitários verificam os headers confiáveis, chaves, falha fechada, ausência de consulta de senha durante o bloqueio e criação da sessão quando a reserva volta a ser aceita:

```sh
npm test
npm run typecheck
npm run lint
```

Os testes SQL são opcionais e usam somente um contêiner local descartável, sem ler `DATABASE_URL`. Criam e removem um schema exclusivo no contêiner informado. Requerem Docker e a imagem oficial do PostgreSQL:

```sh
docker run --detach --rm --name debinatos-login-test --env POSTGRES_PASSWORD=local-disposable-only postgres:17-alpine
# Aguarde o PostgreSQL ficar pronto.
LOGIN_RATE_LIMIT_TEST_CONTAINER=debinatos-login-test npm test
docker stop debinatos-login-test
```

A suíte SQL cobre limite por conta e origem, troca de IP, janela fixa, recuperação após expiração, limpeza limitada e reservas em vinte/quarenta conexões simultâneas. Não requer credenciais de administrador da aplicação.

Referências: [PostgreSQL — INSERT / ON CONFLICT](https://www.postgresql.org/docs/17/sql-insert.html), [OWASP — Login Throttling](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#login-throttling).
