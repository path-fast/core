# Path-Fast - Checklist Priorizada (MVP -> v1)

Este plano foi alinhado com as issues abertas no GitHub. Quando houver conflito entre checklist e issue, a issue tem prioridade de execução.

## Regras de priorização

- Prioridade fonte de verdade: issues do repositório.
- Em caso de conflito de escopo, a issue substitui o item do checklist.
- Ordem recomendada: MVP primeiro, depois v0.2, depois v0.3.

## MVP (impacto imediato)

- [x] `#29` feat: non-interactive add flags
- [x] `#30` feat: dry-run mode for go
- [x] `#31` feat: import/export config
- [x] `#32` feat: json output mode
- [x] `#33` feat: doctor diagnostics command
- [x] `#34` chore: ci + tests baseline

## v0.2 (adoção por power users e IA)

- [ ] Reaproveitar entregas de `#31` e `#32` para automação por agentes.
- [ ] Adicionar busca fuzzy em `pf go` com sugestão de aliases.
- [ ] Publicar completions oficiais para `zsh`, `bash` e `fish`.
- [ ] Criar `pf validate` com suporte a saída humana e `--json`.

## v0.3 (confiabilidade e confiança)

- [ ] Expandir baseline da `#34` para e2e cross-platform.
- [ ] Adicionar versionamento de schema de config e migrador automático.
- [ ] Estabelecer semver e `CHANGELOG.md` obrigatório por release.

## v1 (recomendação ampla)

- [ ] Implementar perfis de contexto (`work`, `personal`, `client-x`).
- [ ] Hooks opcionais (`pre-go`, `post-go`) por projeto.
- [ ] Catálogo compartilhável de paths de time com merge controlado.
- [ ] Consolidar docs AI-friendly com troubleshooting avançado.
- [ ] Publicar página de segurança com práticas recomendadas.

## Links

- Projeto GitHub: https://github.com/orgs/path-fast/projects/4
- Issues: `#29`, `#30`, `#31`, `#32`, `#33`, `#34`
