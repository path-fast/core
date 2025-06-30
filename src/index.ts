#!/usr/bin/env node

import { Command } from 'commander';
import { addPath } from './commands/add-path';
import { goPath } from './commands/go-path';
import { listPaths } from './commands/list-paths';
import { deletePath } from './commands/delete';
import { editPath } from './commands/edit-path';

const program = new Command();

program
  .name('pf')
  .description('A CLI tool to manage project paths with shortcuts')
  .version('1.0.0'); // Check

program
  .command('add <path> <command>')
  .description('Add a project path with a shortcut')
  .action(addPath); // Check

program
  .command('go <command>')
  .option('--nc', 'Do not execute additional commands')
  .description('Navigate to the project path, open it in VS Code, and run your custom commands.')
  .action(goPath);

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
