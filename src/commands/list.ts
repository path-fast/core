import path from 'path';
import { readJsonFile } from './shered/read-file';

// Caminho do arquivo JSON
const filePath = path.resolve(__dirname, '../../paths.json');

export function listPaths(): void {
  const data = readJsonFile();

  if (data.length === 0) {
    console.log('No paths found.');
    return;
  }

  console.log('List of paths:');
  console.table(data);
}

