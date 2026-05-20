# Path-Fast 🚀 
#### Traduzido: [en](/docs/README.md)

![npm version](https://img.shields.io/npm/v/path-fast)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![CI Tests](https://github.com/path-fast/core/actions/workflows/tests.yml/badge.svg)

**Path-Fast** é uma ferramenta CLI 🛠️ para salvar caminhos com um atalho (alias/comando), abrir no seu IDE e opcionalmente executar comandos extras. Ideal para entrar em projetos e preparar o ambiente rapidamente.

---

## Funcionalidades ✨

- **Salvar caminhos com aliases** 📌: Armazene rapidamente caminhos e associe-os a um alias personalizado.
- **Navegar e abrir projetos** 📂➡️💻: Use atalhos para navegar até caminhos e abri-los no VS Code.
- **Suporte para comandos adicionais** 🎛️: Execute comandos predefinidos ao navegar para um caminho.
- **Edição interativa** ✍️: Modifique caminhos, comandos ou parâmetros adicionais por meio de uma interface simples e interativa.
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
  - `--ide <comando>`: IDE customizado (pula prompts).
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
- `pf doctor`: Diagnóstico de config/ambiente (`--json`).
- `pf edit <comando ou índice>`: Edita interativamente.
- `pf delete <comando>`: Remove entrada.
- `pf set-ide`: IDE global (ex.: `code .`).

> `pf validate` está previsto para v0.2. Veja [JSON-SCHEMA.md](JSON-SCHEMA.md).

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

Durante o `pf add` (sem flags), você pode:
- Adicionar um comando de IDE personalizado para este caminho (ex.: `cursor .`, `idea .`, `cursor .`).
- Adicionar um ou mais comandos adicionais para executar com `pf go <comando>`.

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
pf doctor
pf export -o backup.json
pf import backup.json
```

### Listar Todos os Caminhos Salvos 📜

Exibe uma lista de todos os caminhos salvos:

```bash
pf list
```

### Editar um Caminho Salvo ✍️

Edite campos de uma entrada de forma interativa:

```bash
pf edit <comando ou índice>
```

- É possível editar: Caminho, Comando (alias), Comando de IDE, Comandos adicionais.
- Use `pf list` para visualizar índices (mostrados na tabela) e editar por índice.
- ⚠️ `exit` é reservado nos prompts e não pode ser usado como comando.

### Deletar um Caminho ❌

Remova uma entrada pelo seu atalho (comando):

```bash
pf delete <comando>
```

---

## Exemplos 🛠️

1) Salvar projeto e adicionar extras interativamente:

```bash
pf add /srv/api api
# Responda aos prompts para adicionar comando de IDE (opcional)
# e comandos adicionais (ex.: "pnpm install", "pnpm dev").
```

2) IDE global (usado quando a entrada não tem um próprio):

```bash
pf set-ide
# Quando solicitado, informe algo como: code .
# Outros exemplos: cursor . | idea . | subl .
```

3) Abrir projeto e executar extras:

```bash
pf go api
pf go api --extra   # pular extras
pf go api --code    # pular IDE
```

4) Editar campos:

```bash
pf edit api
pf list   # ver índices
pf edit 0 # editar por índice
```

5) Remover uma entrada:

```bash
pf delete api
```

---

## Configuração ⚙️

Arquivos no diretório home:

- `~/.path-fast/paths.json` — caminhos salvos e comandos
- `~/.path-fast/ide-config.json` — comando de IDE global

Precedência do comando de IDE ao executar `pf go <comando>`:

1. Comando de IDE da entrada (definido no `pf add` ou `pf edit`).
2. Comando de IDE global (`pf set-ide`).
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

- [Inquirer](https://www.npmjs.com/package/inquirer) 💬
- [Commander](https://www.npmjs.com/package/commander) 🛠️