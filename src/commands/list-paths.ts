import { readJsonFile } from '../utils/write-read-json';

export function listPaths(): void {
  const data = readJsonFile();

  if (data.length === 0) {
    console.error('No paths found. Add a path first using path-fast add <project-path> <your-command>');
    return;
  }

  console.log('List of paths:');
  console.table(data);
}

