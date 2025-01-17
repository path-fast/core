import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const filePath = path.resolve(__dirname, '../../paths.json');

interface PathEntry {
  path: string;
  command: string;
  additional: string;
}

export function goPath(command: string) {
  if (!fs.existsSync(filePath)) {
    console.error('Path file does not exist. Add a path first using add-path.');
    return;
  }

  const data: PathEntry[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const entry = data.find(item => item.command === command);

  if (!entry) {
    console.error(`No path found for command "${command}"`);
    return;
  }

  const { path: targetPath } = entry;

  process.chdir(targetPath);
  exec('code .', (err) => {
    if (err) {
      console.error('Error opening VS Code:', err.message);
    } else {
      console.log(`Opened ${targetPath} in VS Code`);
    }
  });
}
