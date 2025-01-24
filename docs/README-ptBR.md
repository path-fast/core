Aqui está o seu README traduzido para o português:

---

# Path-Fast 🚀

**Path-Fast** é uma poderosa ferramenta CLI 🛠️ projetada para otimizar seu fluxo de trabalho, permitindo que você gerencie e navegue pelos caminhos de projetos 📂 com comandos personalizados 🧩 e atalhos 🏃‍♂️. Com o Path-Fast, você pode facilmente salvar caminhos, criar aliases e executar comandos adicionais ⚡ com um único atalho.

---

## Funcionalidades ✨

- **Salvar caminhos com aliases** 📌: Armazene rapidamente caminhos e associe-os a um comando personalizado.
- **Navegar e abrir projetos** 📂➡️💻: Use atalhos para navegar até os caminhos e abri-los no VS Code.
- **Suporte a comandos adicionais** 🎛️: Execute comandos predefinidos ao navegar até um caminho.
- **Edição interativa** ✍️: Modifique caminhos, comandos ou parâmetros adicionais por meio de uma interface interativa simples.
- **Instalação global** 🌐: Disponível de qualquer lugar no seu terminal.

---

## Instalação 🔧

Instale **Path-Fast** globalmente usando npm:

```bash
npm install -g path-fast
```

---

## Uso 📝

### Adicionar um Caminho ➕

Salve o caminho de um projeto com um alias personalizado:

```bash
pf add <caminho> <comando>
```

- `caminho` 📂: O caminho relativo ou absoluto para o projeto. Use `.` para se referir ao diretório atual.
- `comando` 🧩: O alias que você deseja usar para este caminho.
- Exemplo:
  ```bash
  pf add ./meu-projeto meuproj
  ```
  Ou para adicionar o diretório atual:
  ```bash
  pf add . diretoriocorrente
  ```

**Parâmetro Opcional:**

Ao adicionar um caminho, você será solicitado a adicionar comandos adicionais 💬 que serão executados sempre que o alias for utilizado.

### Ir para um Caminho 🏃‍♂️

Navegue até um caminho salvo e abra-o no VS Code:

```bash
pf go <comando> [-nc]
```

- `comando` 🧩: O alias do caminho para o qual você deseja navegar.
- `-nc` 🚫: Pular a execução de comandos adicionais associados ao caminho.
- Exemplo:
  ```bash
  pf go meuproj
  pf go meuproj -nc
  ```

### Listar Todos os Caminhos Salvos 📜

Exiba uma lista de todos os caminhos salvos:

```bash
pf list
```

### Editar um Caminho Salvo ✍️

Edite interativamente um caminho salvo:

```bash
pf edit <comando ou índice>
```

- `comando` 🧩: O alias do caminho que você deseja editar.
- `índice` 🔢: O índice numérico do caminho salvo (use `pf list` para encontrá-lo).

### Deletar um Caminho ❌

Remova um caminho salvo pelo seu alias ou índice:

```bash
pf delete <comando ou índice>
```

---

## Exemplos 🛠️

1. Adicionar um caminho de projeto e alias:
   ```bash
   pf add ./meu-app app
   ```

2. Adicionar o diretório atual como um caminho de projeto:
   ```bash
   pf add . diretoriocorrente
   ```

3. Navegar até o caminho salvo e abri-lo no VS Code:
   ```bash
   pf go app
   ```

4. Listar todos os caminhos salvos:
   ```bash
   pf list
   ```

5. Editar um caminho salvo:
   ```bash
   pf edit app
   ```

6. Deletar um caminho salvo:
   ```bash
   pf delete app
   ```

---

## Configuração ⚙️

**Path-Fast** salva os caminhos em um arquivo JSON 📄 localizado no seu diretório home em `.path-fast/dist/paths.json`. Você pode fazer backup ou editar manualmente esse arquivo, se necessário.

---

## Licença 📜

Este projeto é licenciado sob a Licença MIT.

---

## Contribuindo 🤝

Contribuições são bem-vindas! 🎉 Fique à vontade para abrir um problema 🐛 ou enviar um pull request 📬 para o [repositório no GitHub](https://github.com/eduardonicola/path-fast).

---

## Agradecimentos 🙏

Agradecimentos aos desenvolvedores e mantenedores das seguintes bibliotecas:

- [Inquirer](https://www.npmjs.com/package/inquirer)💬
- [commander](https://www.npmjs.com/package/commander)🛠️

---

Se precisar de mais alguma coisa, me avise!