#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const add_path_1 = require("./commands/add-path");
const go_path_1 = require("./commands/go-path");
const program = new commander_1.Command();
program
    .command('add <path> <command>')
    .description('Add a project path with a shortcut')
    .action(add_path_1.addPath);
program
    .command('go <command>')
    .description('Navigate to the project path and open in VS Code')
    .action(go_path_1.goPath);
program.parse(process.argv);
