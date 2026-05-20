#!/usr/bin/env node

import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { addPath } from './commands/add-path.js';
import { goPath } from './commands/go-path.js';
import { listPaths } from './commands/list-paths.js';
import { deletePath } from './commands/delete.js';
import { editPath } from './commands/edit-path.js';
import { setIde } from './commands/ide-set.js';
import { exportConfigCommand } from './commands/export-config.js';
import { importConfigCommand } from './commands/import-config.js';
import { doctorCommand } from './commands/doctor.js';

const program = new Command();

program
.name('pf')
.description('A CLI tool to manage project paths with shortcuts')
.version(pkg.version);

program
  .command('add <path> <command>')
  .description('Add a project path with a shortcut')
  .option('--ide <command>', 'Custom IDE command for this entry (skips interactive prompts)')
  .option('--extra <command>', 'Additional command to run on go (repeatable)', (value, previous: string[]) => {
    return previous.concat([value]);
  }, [] as string[])
  .option('--json', 'Machine-readable JSON output')
  .addHelpText('after', `
Examples:
  $ pf add . api --ide "cursor ." --extra "make up" --extra "npm run dev"
  $ pf add /projects/app app --extra "docker compose up -d"`)
  .action(addPath);
  
program
  .command('go <command>')
  .option('-c, --code', 'Do not execute IDE command')
  .option('-e, --extra', 'Do not execute additional commands')
  .option('--dry-run', 'Preview execution without side effects')
  .option('--json', 'Machine-readable JSON output')
  .description('Navigate to the project path, open it in your IDE, and run your custom commands.')
  .action(goPath);

program
  .command('list')
  .description('List all registered paths')
  .option('--json', 'Machine-readable JSON output')
  .action(listPaths);

program
  .command('delete <command>')
  .description('Delete a path by its command (shortcut)')
  .action(deletePath); 

program
  .command('edit <command>')
  .description('Edit your shortcut')
  .action(editPath); 

program
  .command('set-ide')
  .description("Set your preferred IDE for opening projects ex: pf set-ide 'code .'")
  .action(setIde);

program
  .command('export')
  .description('Export paths and IDE config as JSON')
  .option('--json', 'Machine-readable JSON output')
  .option('-o, --out <file>', 'Write export to file instead of stdout')
  .action(exportConfigCommand);

program
  .command('import <file>')
  .description('Import config from a JSON file (validates before applying)')
  .option('--json', 'Machine-readable JSON output')
  .action(importConfigCommand);

program
  .command('doctor')
  .description('Diagnose common configuration and environment issues')
  .option('--json', 'Machine-readable JSON output')
  .action(doctorCommand);

program.parse(process.argv);
