# Path-Fast 🚀 
#### Traduzido: [en](/docs/README.md)

![npm version](https://img.shields.io/npm/v/path-fast)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

**Path-Fast** é uma ferramenta CLI 🛠️ que simplifica a navegação em projetos permitindo que você salve e gerencie caminhos usados frequentemente com aliases e atalhos personalizados. Seja para abrir um projeto rapidamente no VS Code ou executar scripts de configuração automaticamente, o Path-Fast torna tudo rápido e fácil.

---

## Funcionalidades ✨

- **Salvar caminhos com aliases** 📌: Armazene rapidamente caminhos e associe-os a um alias personalizado.
- **Navegar e abrir projetos** 📂➡️💻: Use atalhos para navegar até caminhos e abri-los no VS Code.
- **Suporte para comandos adicionais** 🎛️: Execute comandos predefinidos ao navegar para um caminho.
- **Edição interativa** ✍️: Modifique caminhos, comandos ou parâmetros adicionais por meio de uma interface simples e interativa.
- **Instalação global** 🌐: Disponível de qualquer lugar no seu terminal.

---

## Instalação 🔧

Instale o **Path-Fast** globalmente usando npm:

```bash
npm install -g path-fast
```

---

## Uso 📝

### Adicionar um Caminho ➕

Salve o caminho de um projeto com um alias personalizado:

```bash
pf add <caminho> <alias>
```

- `caminho` 📂: Caminho relativo ou absoluto para o projeto. Use `.` para se referir ao diretório atual.
- `alias` 🧩: O alias que você deseja usar para este caminho.

Exemplo:
```bash
pf add /meu-projeto meualias
```

Ou para adicionar o diretório atual:
```bash
pf add . diretorioatual
```

**Parâmetro Opcional:**

Ao adicionar um caminho, você será solicitado a adicionar comandos adicionais 💬 que serão executados sempre que o alias for usado.

### Navegar para um Caminho 🏃‍♂️

Navegue para um caminho salvo e abra no VS Code:

```bash
pf go <alias> [-e ou --extra]
```

- `alias` 🧩: O alias do caminho para onde deseja navegar.
- `-e --extra` 🚫: Ignorar a execução dos comandos adicionais associados ao caminho.

Exemplo:
```bash
pf go meualias
pf go meualias --extra
```

- `-c --code` 🚫: Ignorar a execução do comando 'code .' associado ao caminho.

Exemplo:
```bash
pf go meualias
pf go meualias --code
```

### Listar Todos os Caminhos Salvos 📜

Exibe uma lista de todos os caminhos salvos:

```bash
pf list
```

### Editar um Caminho Salvo ✍️

Edite interativamente um caminho salvo:

```bash
pf edit <alias ou índice>
```

- `alias` 🧩: O alias do caminho que deseja editar.
- `índice` 🔢: O índice numérico do caminho salvo (use `pf list` para encontrar).
- ⚠️ Nota: `exit` é uma palavra reservada e não pode ser usada como alias.

### Deletar um Caminho ❌

Remova um caminho salvo pelo alias ou índice:

```bash
pf delete <alias ou índice>
```

---

## Exemplos 🛠️

1. Adicionar um caminho de projeto e alias:

```bash
pf add /meu-app app
```

2. Adicionar o diretório atual como caminho de projeto:

```bash
pf add . diretorioatual
```

3. Navegar até o caminho salvo e abrir no VS Code:

```bash
pf go app
```

4. Navegar até um caminho salvo sem abrir no VS Code:

```bash
pf go app --code
```

5. Editar um caminho salvo:

```bash
pf edit app
```

6. Deletar um caminho salvo:

```bash
pf delete app
```

7. Listar todos os caminhos salvos:

```bash
pf list
```

---

## Configuração ⚙️

O **Path-Fast** salva os caminhos em um arquivo JSON 📄 localizado no seu diretório home, dentro de:

```bash
~/.path-fast/dist/paths.json
```

Você pode fazer backup ou editar esse arquivo manualmente se desejar.

---

## Licença 📜

Este projeto está licenciado sob a licença MIT.

---

## Contribuindo 🤝

Contribuições são bem-vindas! 🎉 Sinta-se à vontade para abrir uma issue 🐛 ou enviar um pull request 📬 para o [repositório GitHub](https://github.com/eduardonicola/path-fast).

---

## Agradecimentos 🙏

Obrigado aos desenvolvedores e mantenedores das seguintes bibliotecas:

- [Inquirer](https://www.npmjs.com/package/inquirer) 💬
- [Commander](https://www.npmjs.com/package/commander) 🛠️