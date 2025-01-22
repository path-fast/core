#!/usr/bin/env node

import { Command } from 'commander';
import { addPath } from './commands/index';
import { goPath } from './commands/go-path';
import { listPaths } from './commands/list';
import { deletePath } from './commands/delete';
import { editPath } from './commands/edit-path';

const program = new Command();

program
  .command('add <path> <command>')
  .description('Add a project path with a shortcut')
  .action(addPath);

program
  .command('go <command>')
  .option('-nc', 'Do not execute additional commands')
  .description('Navigate to the project path, open it in VS Code, and run your custom commands.')
  .action(goPath);

  program
  .command('list')
  .description('List all registered paths')
  .action(listPaths);

program
  .command('delete <command>')
  .description('Delete a path by its command (shortcut)')
  .action(deletePath);

program
  .command('edit <command>')
  .description('Edit your shortcut' )
  .action(editPath);

program.parse(process.argv);
