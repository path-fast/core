import { readJsonFile } from '../utils/read-file';

export function listPaths(): void {
  const data = readJsonFile();

  if (data.length === 0) {
    console.log('No paths found.');
    return;
  }

  console.log('List of paths:');
  console.table(data);
}

