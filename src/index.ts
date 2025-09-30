#!/usr/bin/env node

import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { addPath } from './commands/add-path.js';
import { goPath } from './commands/go-path.js';
import { listPaths } from './commands/list-paths.js';
import { deletePath } from './commands/delete.js';
import { editPath } from './commands/edit-path.js';

const program = new Command();

program
.name('pf')
.description('A CLI tool to manage project paths with shortcuts')
.version(pkg.version);

program
  .command('add <path> <command>')
  .description('Add a project path with a shortcut')
  .action(addPath); // Check
  
program
  .command('go <command>')
  .option('-c , --code', 'Do not execute "code ." command')
  .option('-e , --extra', 'Do not execute additional commands')
  .description('Navigate to the project path, open it in VS Code, and run your custom commands.')
  .action(goPath);// Check

program
  .command('list')
  .description('List all registered paths')
  .action(listPaths); // Check

program
  .command('delete <command>')
  .description('Delete a path by its command (shortcut)')
  .action(deletePath); // Check

program
  .command('edit <command>')
  .description('Edit your shortcut' )
  .action(editPath); // Check

program.parse(process.argv);
