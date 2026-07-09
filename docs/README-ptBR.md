# Path-Fast 🚀 
#### Traduzido: [en](/README.md)

![npm version](https://img.shields.io/npm/v/path-fast)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![CI Tests](https://img.shields.io/github/actions/workflow/status/path-fast/core/publish.yml?branch=master&label=CI%20Tests)

**Path-Fast** é uma ferramenta CLI 🛠️ para salvar caminhos com um atalho (alias/comando), abrir no seu IDE e opcionalmente executar comandos extras. Ideal para entrar em projetos e preparar o ambiente rapidamente.

---

## Funcionalidades ✨

- **Salvar caminhos com aliases** 📌: Armazene rapidamente caminhos e associe-os a um alias personalizado.
- **Navegar e abrir projetos** 📂➡️💻: Use atalhos para navegar até caminhos e abri-los no seu IDE.
- **Suporte para comandos adicionais** 🎛️: Execute comandos predefinidos ao navegar para um caminho.
- **Configuração via flags** 🏷️: Configure IDE, extras, edições e exclusões por flags — sem prompts interativos.
- **Instalação global** 🌐: Disponível de qualquer lugar no seu terminal.

---

## Instalação 🔧

Instale o **Path-Fast** globalmente usando npm ou seu gerenciador de pacotes preferido:

```bash
npm install -g path-fast
```

---

## Uso 📝

### Visão Geral dos Comandos

- `pf add <caminho> <comando>`: Salva um caminho com um atalho.
  - `--ide <comando>`: Comando de IDE da entrada.
  - `--extra <comando>`: Comando adicional, repetível.
  - `--json`: Saída JSON.
- `pf go <comando>`: Navega até o caminho, abre no IDE e executa extras.
  - `-c, --code`: Pular a abertura do IDE.
  - `-e, --extra`: Pular comandos adicionais.
  - `--dry-run`: Simular sem efeitos colaterais.
  - `--json`: Saída JSON (com `--dry-run`).
- `pf list`: Lista entradas (`--json`).
- `pf export`: Exporta config (`--json`, `-o <arquivo>`).
- `pf import <arquivo>`: Importa após validação (`--json`).
- `pf edit <comando ou índice>`: Edita entrada via flags.
  - `-p, --path <caminho>`: Novo diretório do projeto.
  - `-c, --code <comando>`: Novo alias do atalho.
  - `-i, --ide <comando>`: Novo comando de IDE da entrada.
  - `-e, --extra <comandos>`: Substitui comandos adicionais (separados por vírgula; use `clear` para remover todos).
- `pf delete <comando ou índice>`: Remove entrada (`-y, --yes` obrigatório para confirmar).
- `pf set-ide`: Define IDE global padrão.
  - `-i, --ide <comando>`: Comando do IDE (ex.: `code .`, `cursor .`).

### Adicionar um Caminho ➕

Salve um caminho com um atalho (alias/comando):

```bash
pf add <caminho> <comando>
```

- `caminho` 📂: Absoluto ou relativo. Use `.` para o diretório atual.
- `comando` 🧩: O nome do atalho (ex.: `app`, `api`, `trabalho`).

Exemplos:

```bash
pf add /meu-projeto app
pf add . diretorioatual
pf add . api --ide "cursor ." --extra "make up" --extra "npm run dev"
```

Flags opcionais:

- `--ide <comando>`: Comando de IDE para esta entrada (ex.: `cursor .`, `idea .`).
- `--extra <comando>`: Comando adicional executado no `pf go` (repetível).

### Navegar para um Caminho 🏃‍♂️

Vá até um caminho salvo, abra no IDE e execute (ou não) comandos extras:

```bash
pf go <comando> [--code] [--extra]
```

- `--code` 🚫: Pula a abertura do IDE (seja por entrada ou global).
- `--extra` 🚫: Pula a execução dos comandos adicionais.

Exemplos:

```bash
pf go app
pf go app --extra   # não executa extras
pf go app --code    # não abre o IDE
pf go app --dry-run # apenas simula
pf list --json
pf export -o backup.json
pf import backup.json
```

### Listar Todos os Caminhos Salvos 📜

Exibe uma lista de todos os caminhos salvos:

```bash
pf list
```

### Editar um Caminho Salvo ✍️

Edite um ou mais campos via flags (pelo menos uma flag é obrigatória):

```bash
pf edit <comando ou índice> [flags]
```

| Flag | Campo |
|------|-------|
| `-p, --path <caminho>` | Diretório do projeto |
| `-c, --code <comando>` | Alias do atalho |
| `-i, --ide <comando>` | Comando de IDE da entrada |
| `-e, --extra <comandos>` | Comandos adicionais (separados por vírgula; `clear` remove todos) |

Exemplos:

```bash
pf edit api --path /novo/caminho/api
pf edit api --ide "cursor ."
pf edit api --extra "make up,npm run dev"
pf edit api --extra clear
pf list        # ver índices
pf edit 0 -c novoalias
```

### Deletar um Caminho ❌

Remova uma entrada pelo atalho ou índice (`-y` obrigatório):

```bash
pf delete <comando ou índice> -y
```

### Definir IDE Global 💻

```bash
pf set-ide --ide "code ."
pf set-ide -i "cursor ."
```

---

## Exemplos 🛠️

1) Salvar projeto com IDE e extras:

```bash
pf add /srv/api api --ide "cursor ." --extra "pnpm install, pnpm dev"
```

2) IDE global (usado quando a entrada não tem um próprio):

```bash
pf set-ide --ide "code ."
```

3) Abrir projeto e executar extras:

```bash
pf go api
pf go api --extra   # pular extras
pf go api --code    # pular IDE
```

4) Editar campos via flags:

```bash
pf edit api --path /srv/api-v2
pf edit api --extra "docker compose up -d, npm run dev"
pf edit 0 -c api2   # editar por índice do pf list
```

5) Remover uma entrada:

```bash
pf delete api -y
```

---

## Configuração ⚙️

Arquivos no diretório home:

- `~/.path-fast/paths.json` — caminhos salvos e comandos
- `~/.path-fast/ide-config.json` — comando de IDE global

Precedência do comando de IDE ao executar `pf go <comando>`:

1. Comando de IDE da entrada (definido com `pf add --ide` ou `pf edit --ide`).
2. Comando de IDE global (`pf set-ide --ide`).
3. Padrão `code .`.

---

## Licença 📜

Este projeto está licenciado sob a licença MIT.

---

## Contribuindo 🤝

Contribuições são bem-vindas! 🎉 Sinta-se à vontade para abrir uma issue 🐛 ou enviar um pull request 📬 para o [repositório GitHub](https://github.com/path-fast/core).

---

## Agradecimentos 🙏

Obrigado aos desenvolvedores e mantenedores das seguintes bibliotecas:

- [Commander](https://www.npmjs.com/package/commander) 🛠️