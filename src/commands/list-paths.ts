import { readJsonFile } from '../utils/write-read-json.js';
import { printJson, successEnvelope } from '../utils/output.js';
import type { Options } from '../@types/index.js';

export function listPaths(options: Options = {}): void {
  const data = readJsonFile('path');

  if (data.length === 0) {
    if (options.json) {
      printJson(successEnvelope({ paths: [] }));
      return;
    }
    console.error('No paths found. Add a path first using path-fast add <project-path> <your-command>');
    return;
  }

  if (options.json) {
    printJson(successEnvelope({ paths: data }));
    return;
  }

  console.log('List of paths:');
  console.table(data);
}
