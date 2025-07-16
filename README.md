# Path-Fast 🚀 
#### Translated: [pt-BR](/docs/README-ptBR.md)

![npm version](https://img.shields.io/npm/v/path-fast)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

**Path-Fast** is a CLI tool 🛠️ that simplifies project navigation by allowing you to save and manage frequently used paths with custom aliases and shortcuts. Whether you want to open a project quickly in VS Code or run setup scripts automatically, Path-Fast makes it fast and effortless.


---

## Features ✨

- **Save paths with aliases** 📌: Quickly store paths and associate them with a custom alias.
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
pf add <path> <alias>
```

- `path` 📂: The relative or absolute path to the project. Use `.` to refer to the current directory.
- `alias` 🧩: The alias you want to use for this path.
- Example:
  ```bash
  pf add /my-project myproj
  ```
  Or to add the current directory:
  ```bash
  pf add . currentdir
  ```

**Optional Parameter:**

When adding a path, you will be prompted to add additional commands 💬 that will run whenever the alias is used.

### Navigate to a Path 🏃‍♂️

Navigate to a saved path and open it in VS Code:

```bash
pf go <alias> [-e or --extra]
```

- `alias` 🧩: The alias of the path you want to navigate to.
- `-e --extra` 🚫: Skip executing additional commands associated with the path.
- Example:
  ```bash
  pf go myproj
  pf go myproj --extra
  ```

- `-c --code` 🚫: Skip executing 'code .' alias associated with the path.
- Example:
  ```bash
  pf go myproj
  pf go myproj --code
  ```

### List All Saved Paths 📜

Display a list of all saved paths:

```bash
pf list
```

### Edit a Saved Path ✍️

Interactively edit a saved path:

```bash
pf edit <alias or index>
```

- `alias` 🧩: The alias of the path you want to edit.
- `index` 🔢: The numeric index of the saved path (use `pf list` to find it).
- ⚠️ Note: `exit` is a reserved word and cannot be used as an alias
### Delete a Path ❌

Remove a saved path by its alias or index:

```bash
pf delete <alias or index>
```

---

## Examples 🛠️

1. Add a project path and alias:
   ```bash
   pf add /my-app app
   ```

2. Add the current directory as a project path:
   ```bash
   pf add . currentdir
   ```

3. Navigate to the saved path and open it in VS Code:
   ```bash
   pf go app
   ```
4. Navigate to a saved path without opening it in VS Code:
   ```bash
   pf go app --code
   ```

5. Edit a saved path:
   ```bash
   pf edit app
   ```

6. Delete a saved path:
   ```bash
   pf delete app
   ```
7. List all saved paths:
   ```bash
   pf list
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

