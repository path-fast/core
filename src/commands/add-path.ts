import fs from 'fs';
import path from 'path';

const filePath = path.resolve(__dirname, '../../paths.json');

interface PathEntry {
  path: string;
  command: string;
  additional: string;
}

export function addPath(projectPath: string, command: string): void {
  const absolutePath = projectPath === '.' ? process.cwd() : projectPath;

  let data: PathEntry[] = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  data.push({ path: absolutePath, command, additional: '' });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Path added successfully! (${absolutePath} as ${command})`);
}
