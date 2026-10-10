.DEFAULT_GOAL := help

.PHONY: help dev lint test validate update

help:
	@printf '%s\n' \
	  'Comandos disponíveis:' \
	  '  make help      Exibe esta ajuda' \
	  '  make dev       Inicia o servidor de desenvolvimento' \
	  '  make lint      Verifica formatação (Prettier) e tipos (TypeScript)' \
	  '  make test      Executa os testes' \
	  '  make validate  Executa lint e, se passar, os testes' \
	  '  make update    Atualiza todas as dependências para latest e valida'

dev:
	npm run dev

lint:
	npx --no-install prettier --check src next.config.ts postcss.config.mjs tsconfig.json vitest.config.ts
	npm run typecheck

test:
	npm test

validate:
	$(MAKE) lint
	$(MAKE) test

# Atualização manual de todas as dependências, incluindo versões principais.
# Para consultar as atualizações disponíveis antes: npm outdated
# Para atualizar apenas um pacote: npm install next@latest --save-exact
# Para escolher uma versão específica: npm install next@X.Y.Z --save-exact
# Para um pacote de desenvolvimento: npm install -D vitest@latest --save-exact
# As versões instaladas ficam exatas em package.json e package-lock.json.
# Node.js e npm não são atualizados aqui: ajuste .nvmrc e os campos engines,
# devEngines e packageManager do package.json ao trocar essas ferramentas.
# Após atualizar, revise as mudanças nos dois arquivos de dependências.
update:
	npm install --save-exact $$(node -p 'Object.keys(require("./package.json").dependencies || {}).map(name => name + "@latest").join(" ")')
	npm install --save-dev --save-exact $$(node -p 'Object.keys(require("./package.json").devDependencies || {}).map(name => name + "@latest").join(" ")')
	$(MAKE) validate
	npm run build
