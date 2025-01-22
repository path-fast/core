#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("./commands/add-path/index");
const go_path_1 = require("./commands/go-path");
const list_1 = require("./commands/list");
const delete_1 = require("./commands/add-path/delete");
const edit_path_1 = require("./commands/add-path/edit-path");
const program = new commander_1.Command();
program
    .command('add <path> <command>')
    .description('Add a project path with a shortcut')
    .action(index_1.addPath);
program
    .command('go <command>')
    .option('-nc', 'Do not execute additional commands')
    .description('Navigate to the project path, open it in VS Code, and run your custom commands.')
    .action(go_path_1.goPath);
program
    .command('list')
    .description('List all registered paths')
    .action(list_1.listPaths);
program
    .command('delete <command>')
    .description('Delete a path by its command (shortcut)')
    .action(delete_1.deletePath);
program
    .command('edit <command>')
    .description('Edit your shortcut')
    .action(edit_path_1.editPath);
program.parse(process.argv);
