# Path-Fast 🚀 
#### Translated: [pt-BR](/docs/README-ptBR.md)

![npm version](https://img.shields.io/npm/v/path-fast)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

**Path-Fast** is a CLI tool 🛠️ that simplifies project navigation by letting you save paths with a shortcut (alias/command), open them in your IDE, and optionally run extra commands. Perfect for jumping into projects and bootstrapping your environment fast.


---

## Features ✨

- **Save paths with aliases** 📌: Quickly store paths and associate them with a custom alias.
- **Navigate and open projects** 📂➡️💻: Use shortcuts to navigate to paths and open them in your IDE.
- **Support for additional commands** 🎛️: Execute predefined commands when navigating to a path.
- **Interactive editing** ✍️: Modify paths, commands, or additional parameters through a simple interactive interface.
- **Global installation** 🌐: Available from anywhere in your terminal.

---

## Installation 🔧

Install **Path-Fast** globally using npm or yorur preferred package manager:

```bash
npm install -g path-fast
```

---

## Usage 📝

### Commands Overview

- `pf add <path> <command>`: Save a project path with a shortcut.
- `pf go <command>`: Navigate to a saved path, open in your IDE, and run extras.
   - Options:
      - `-c, --code`: Skip opening the IDE command.
      - `-e, --extra`: Skip executing additional commands.
- `pf list`: Show all saved entries.
- `pf edit <command or index>`: Interactively edit a saved entry.
- `pf delete <command>`: Delete an entry by its shortcut.
- `pf set-ide`: Set a global default IDE command (e.g., `code .`).

### Add a Path ➕

Save a project path with a custom shortcut (alias/command):

```bash
pf add <path> <command>
```

- `path` 📂: Absolute or relative. Use `.` for the current directory.
- `command` 🧩: Your shortcut name (e.g., `app`, `api`, `work`).

Examples:

```bash
pf add /my-project app
pf add . currentdir
```

During `pf add`, you can:
- Add a custom IDE command for this specific path (e.g., `cursor .`, `idea .`, `cursor .`).
- Add one or more additional commands that will run when using `pf go <command>`.

### Navigate to a Path 🏃‍♂️

Go to a saved path, open it in your IDE, and optionally run extra commands:

```bash
pf go <command> [--code] [--extra]
```

- `--code` 🚫: Skip the IDE opening step (per-path or global). 
- `--extra` 🚫: Skip executing additional commands.

Examples:

```bash
pf go app
pf go app --extra     # don’t run additionals
pf go app --code      # don’t open IDE
```

### List All Saved Paths 📜

Display a list of all saved paths:

```bash
pf list
```

### Edit a Saved Path ✍️

Interactively edit fields for an entry:

```bash
pf edit <command or index>
```

- Supports editing: Path, Command (alias), IDE Command, Additional commands.
- Use `pf list` first if you prefer editing by index (shown in the table output).
- ⚠️ `exit` is reserved in prompts and cannot be used as a command.
### Delete a Path ❌

Delete a saved entry by its shortcut (command):

```bash
pf delete <command>
```

---

## Examples 🛠️

1) Save a project and add extras interactively:

```bash
pf add /srv/api api
# Answer prompts to add IDE command for this path (optional)
# and additional commands (e.g., "pnpm install", "pnpm dev").
```

2) Global IDE setting (used when an entry doesn’t have its own):

```bash
pf set-ide
# When prompted, enter something like: code .
# Other examples: cursor . | idea . | subl .
```

3) Open the project and run extras:

```bash
pf go api
pf go api --extra   # skip extras
pf go api --code    # skip opening IDE
```

4) Edit fields interactively:

```bash
pf edit api
pf list   # see index numbers
pf edit 0 # edit by index
```

5) Remove an entry:

```bash
pf delete api
```

---

## Configuration ⚙️

Files are stored in your home directory:

- `~/.path-fast/paths.json` — saved paths and commands
- `~/.path-fast/ide-config.json` — global IDE command

IDE command precedence when running `pf go <command>`:

1. Per-entry IDE command (set during `pf add` or via `pf edit`).
2. Global IDE command (`pf set-ide`).
3. Fallback `code .`.

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

