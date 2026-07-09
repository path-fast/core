# Path-Fast 🚀 
#### Translated: [pt-BR](/docs/README-ptBR.md)

![npm version](https://img.shields.io/npm/v/path-fast)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![CI Tests](https://img.shields.io/github/actions/workflow/status/path-fast/core/publish.yml?branch=master&label=CI%20Tests)

**Path-Fast** is a CLI tool 🛠️ that simplifies project navigation by letting you save paths with a shortcut (alias/command), open them in your IDE, and optionally run extra commands. Perfect for jumping into projects and bootstrapping your environment fast.


---

## Features ✨

- **Save paths with aliases** 📌: Quickly store paths and associate them with a custom alias.
- **Navigate and open projects** 📂➡️💻: Use shortcuts to navigate to paths and open them in your IDE.
- **Support for additional commands** 🎛️: Execute predefined commands when navigating to a path.
- **Flag-based configuration** 🏷️: Configure IDE, extras, edits, and deletions via CLI flags — no interactive prompts.
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
  - `--ide <command>`: Per-entry IDE command.
  - `--extra <command>`: Additional command, repeatable.
  - `--json`: Machine-readable output.
- `pf go <command>`: Navigate to a saved path, open in your IDE, and run extras.
  - `-c, --code`: Skip opening the IDE command.
  - `-e, --extra`: Skip executing additional commands.
  - `--dry-run`: Preview steps without changing directory or running commands.
  - `--json`: Machine-readable output (works with `--dry-run`).
- `pf list`: Show all saved entries (`--json` supported).
- `pf export`: Export config bundle as JSON (`--json`, `-o <file>`).
- `pf import <file>`: Import config after validation (`--json`).
- `pf edit <command or index>`: Edit a saved entry via flags.
  - `-p, --path <path>`: New project directory.
  - `-c, --code <command>`: New shortcut alias.
  - `-i, --ide <command>`: New per-entry IDE command.
  - `-e, --extra <commands>`: Replace additional commands (comma-separated; use `clear` to remove all).
- `pf delete <command or index>`: Delete an entry (`-y, --yes` required to confirm).
- `pf set-ide`: Set a global default IDE command.
  - `-i, --ide <command>`: IDE command (e.g., `code .`, `cursor .`).

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
pf add . api --ide "cursor ." --extra "make up" --extra "npm run dev"
```

Optional flags:

- `--ide <command>`: Per-entry IDE command (e.g., `cursor .`, `idea .`).
- `--extra <command>`: Additional command to run on `pf go` (repeatable).

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
pf go app --dry-run   # preview only
pf list --json
pf export -o backup.json
pf import backup.json
```

### List All Saved Paths 📜

Display a list of all saved paths:

```bash
pf list
```

### Edit a Saved Path ✍️

Edit one or more fields using flags (at least one flag is required):

```bash
pf edit <command or index> [flags]
```

| Flag | Field |
|------|-------|
| `-p, --path <path>` | Project directory |
| `-c, --code <command>` | Shortcut alias |
| `-i, --ide <command>` | Per-entry IDE command |
| `-e, --extra <commands>` | Additional commands (comma-separated; `clear` removes all) |

Examples:

```bash
pf edit api --path /new/location/api
pf edit api --ide "cursor ."
pf edit api --extra "make up,npm run dev"
pf edit api --extra clear
pf list        # see index numbers
pf edit 0 -c newalias
```

### Delete a Path ❌

Delete a saved entry by shortcut or index (`-y` required):

```bash
pf delete <command or index> -y
```

### Set Global IDE 💻

```bash
pf set-ide --ide "code ."
pf set-ide -i "cursor ."
```

---

## Examples 🛠️

1) Save a project with IDE and extras:

```bash
pf add /srv/api api --ide "cursor ." --extra "pnpm install, pnpm dev"
```

2) Global IDE setting (used when an entry doesn’t have its own):

```bash
pf set-ide --ide "code ."
```

3) Open the project and run extras:

```bash
pf go api
pf go api --extra   # skip extras
pf go api --code    # skip opening IDE
```

4) Edit fields via flags:

```bash
pf edit api --path /srv/api-v2
pf edit api --extra "docker compose up -d,npm run dev"
pf edit 0 -c api2   # edit by index from pf list
```

5) Remove an entry:

```bash
pf delete api -y
```

---

## Configuration ⚙️

Files are stored in your home directory:

- `~/.path-fast/paths.json` — saved paths and commands
- `~/.path-fast/ide-config.json` — global IDE command

IDE command precedence when running `pf go <command>`:

1. Per-entry IDE command (set via `pf add --ide` or `pf edit --ide`).
2. Global IDE command (`pf set-ide --ide`).
3. Fallback `code .`.

---

## License 📜

This project is licensed under the MIT License.


---

## Contributing 🤝

Contributions are welcome! 🎉 Feel free to open an issue 🐛 or submit a pull request 📬 to the [GitHub repository](https://github.com/path-fast/core).

---

## Acknowledgements 🙏

Thanks to the developers and maintainers of the following libraries:

- [commander](https://www.npmjs.com/package/commander)🛠️

