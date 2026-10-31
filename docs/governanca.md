# Governança do repositório

## Estado verificado em 31/10/2026

As proteções efetivas de `main` e `dev` **não foram verificadas nem alteradas** nesta implementação. O conector disponível não expõe administração de branches/rulesets; o GitHub CLI está sem autenticação e a consulta pelo navegador a Settings/Rules não deu acesso às configurações (login/404). Esses resultados não provam ausência de proteção. O plano do repositório, as regras herdadas da organização e eventuais exceções também não foram confirmados.

O arquivo [main-dev.json](../.github/rulesets/main-dev.json) é uma proposta revisável e importável. Versioná-lo ou aprovar este PR não ativa regras no GitHub. A ativação e a confirmação abaixo são pendências operacionais da [issue #16](https://github.com/iweti/Debinatos/issues/16); ela só deve ser encerrada depois de registrar as evidências das duas branches.

## Política proposta

O ruleset usa os alvos exatos `refs/heads/main` e `refs/heads/dev`, sem exclusões ou atores com bypass. Exige PR, uma aprovação, aprovação posterior ao último push, resolução de conversas e o check **Validação**, emitido pelo GitHub Actions (app ID `15368`). A aprovação anterior é descartada quando há novos commits revisáveis; a branch precisa estar atualizada com a base. Também bloqueia exclusão e force push. O requisito de PR impede pushes diretos, inclusive de administradores enquanto a regra estiver ativa e sem bypass. Não se usa a regra “Restrict updates”, que bloquearia também merges sem um ator com bypass. [Referência dos campos e regras](https://docs.github.com/en/rest/repos/rules#create-a-repository-ruleset).

É necessário um revisor elegível diferente do autor/último responsável pelo push. Se só houver um mantenedor elegível, organize a revisão antes da ativação; não acrescente bypass para contornar a política.

## Aplicar depois da revisão

1. Acesse [Settings → Rules → Rulesets](https://github.com/iweti/Debinatos/settings/rules) com uma conta administradora ou com permissão para editar regras. Confira também regras herdadas e proteções clássicas em Settings → Branches. Preserve regras existentes: elas podem se somar ao novo ruleset.
2. Confirme a disponibilidade do recurso no plano. Rulesets de branches estão disponíveis em repositórios públicos nos planos Free, e em repositórios privados nos planos Pro, Team e Enterprise Cloud. Visibilidade, plano e permissão insuficientes podem impedir a aplicação; registre a limitação em vez de afirmar que a proteção está ativa. [Disponibilidade e permissões](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).
3. Execute o workflow CI em um PR destinado a `dev` e outro a `main`. Confirme que o check publicado se chama **Validação** e que sua origem é GitHub Actions. Mantenha esse nome estável no workflow e no JSON.
4. Em **New ruleset → Import a ruleset**, selecione [main-dev.json](../.github/rulesets/main-dev.json). Confira os dois alvos, a lista de bypass vazia, uma aprovação, o check obrigatório com GitHub Actions como origem e a exigência de atualização da base. O JSON propõe **Active**: ao salvar/criar, a regra passa a valer. [Importação e criação de rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository).
5. Reabra a regra salva e as regras aplicáveis de **cada** branch. Em PRs de verificação sem mudanças funcionais, confira merge bloqueado sem aprovação e com `Validação` pendente/falhando; depois confirme o bloqueio após novo push e após mudança da base. Registre os resultados e o bloqueio de push direto mostrado nas regras efetivas. Não é necessário tentar gravar em produção para conferir a configuração.

Registre na issue: data, executor, URL/ID do ruleset, estado Active, alvos, check e origem, ausência ou lista de exceções, regras herdadas, resultado dos PRs de verificação e eventuais limitações de plano/permissão. Anexe evidências sem tokens. Uma tela inacessível ou um arquivo JSON validado não substitui essa confirmação.

## Dependências e auditoria

[Dependabot](../.github/dependabot.yml) verifica npm e GitHub Actions semanalmente e abre PRs de atualização de versão para `dev`. A estratégia npm `increase` conserva o formato exato das versões existentes; revise o manifesto e o lockfile juntos, sem adicionar intervalos. Actions continuam fixadas por SHA completo, com a tag em comentário. Os PRs seguem revisão e CI, sem auto merge ou bypass. [Opções do Dependabot](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference).

O GitHub lê a configuração do Dependabot na branch padrão; ela precisa chegar à `main` para ativar as atualizações. Atualizações de segurança usam a branch padrão e dependem de habilitação nas configurações de segurança do repositório; a configuração de version updates não comprova que esse recurso esteja ativo. [Como habilitar version updates](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-version-updates).

O job **Validação** roda `npm audit --omit=dev --audit-level=high` após a instalação. Advisories de produção altos/críticos ou falha na consulta reprovam o job; moderados/baixos não atingem esse limiar. Dependências de desenvolvimento ficam fora dessa etapa. A auditoria consulta os advisories disponíveis no registro e não garante ausência de vulnerabilidades. [Documentação do npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit).
