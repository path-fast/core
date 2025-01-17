#!/usr/bin/env node

import { Command } from 'commander';
import { addPath } from './commands/add-path';
import { goPath } from './commands/go-path';

const program = new Command();

program
  .command('add <path> <command>')
  .description('Add a project path with a shortcut')
  .action(addPath);

program
  .command('go <command>')
  .description('Navigate to the project path and open in VS Code')
  .action(goPath);

program.parse(process.argv);
