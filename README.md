# Path-Fast 🚀 
#### Translated: [pt-BR](/docs/README-ptBR.md)

**Path-Fast** is a powerful CLI tool 🛠️ designed to streamline your workflow by allowing you to manage and navigate project paths 📂 with custom commands 🧩 and shortcuts 🏃‍♂️. With Path-Fast, you can easily save paths, create aliases, and execute additional commands ⚡ with a single shortcut.

---

## Features ✨

- **Save paths with aliases** 📌: Quickly store paths and associate them with a custom command.
- **Navigate and open projects** 📂➡️💻: Use shortcuts to navigate to paths and open them in VS Code.
- **Support for additional commands** 🎛️: Execute predefined commands when navigating to a path.
- **Interactive editing** ✍️: Modify paths, commands, or additional parameters through a simple interactive interface.
- **Global installation** 🌐: Available from anywhere in your terminal.

---

## Installation 🔧

Install **Path-Fast** globally using npm:

```bash
npm install -g path-fast
```

---

## Usage 📝

### Add a Path ➕

Save a project path with a custom alias:

```bash
pf add <path> <command>
```

- `path` 📂: The relative or absolute path to the project. Use `.` to refer to the current directory.
- `command` 🧩: The alias you want to use for this path.
- Example:
  ```bash
  pf add ./my-project myproj
  ```
  Or to add the current directory:
  ```bash
  pf add . currentdir
  ```

**Optional Parameter:**

When adding a path, you will be prompted to add additional commands 💬 that will run whenever the alias is used.

### Go to a Path 🏃‍♂️

Navigate to a saved path and open it in VS Code:

```bash
pf go <command> [-nc]
```

- `command` 🧩: The alias of the path you want to navigate to.
- `-nc` 🚫: Skip executing additional commands associated with the path.
- Example:
  ```bash
  pf go myproj
  pf go myproj -nc
  ```

### List All Saved Paths 📜

Display a list of all saved paths:

```bash
pf list
```

### Edit a Saved Path ✍️

Interactively edit a saved path:

```bash
pf edit <command or index>
```

- `command` 🧩: The alias of the path you want to edit.
- `index` 🔢: The numeric index of the saved path (use `pf list` to find it).

### Delete a Path ❌

Remove a saved path by its alias or index:

```bash
pf delete <command or index>
```

---

## Examples 🛠️

1. Add a project path and alias:
   ```bash
   pf add ./my-app app
   ```

2. Add the current directory as a project path:
   ```bash
   pf add . currentdir
   ```

3. Navigate to the saved path and open it in VS Code:
   ```bash
   pf go app
   ```

4. List all saved paths:
   ```bash
   pf list
   ```

5. Edit a saved path:
   ```bash
   pf edit app
   ```

6. Delete a saved path:
   ```bash
   pf delete app
   ```

---

## Configuration ⚙️

**Path-Fast** saves paths in a JSON file 📄 located in your home directory under `.path-fast/dist/paths.json`. You can back up or manually edit this file if needed.

---

## License 📜

This project is licensed under the MIT License.

---

## Contributing 🤝

Contributions are welcome! 🎉 Feel free to open an issue 🐛 or submit a pull request 📬 to the [GitHub repository](https://github.com/eduardonicola/path-fast).

---

## Acknowledgements 🙏

Thanks to the developers and maintainers of the following libraries:


- [Inquirer](https://www.npmjs.com/package/inquirer)💬
- [commander](https://www.npmjs.com/package/commander)🛠️

