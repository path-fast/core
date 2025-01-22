import fs from 'fs';
import os from 'os'
import path from 'path';
import { exec, spawn } from 'child_process';
import { filePath } from '../utils/json-path';



export function goPath(command: string, option: Opitions ): void {
  if (!fs.existsSync(filePath)) {
    console.error('Path file does not exist. Add a path first using path-fast add <project-path> <your-command>');
    return;
  }

  const data: PathEntry[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const entry = data.find(item => item.command === command);

  if (!entry) {
    console.error(`No path found for command "${command}"`);
    return;
  }

  const { path: targetPath } = entry;

  process.chdir(changeToHomeAndTarget(targetPath));

  exec('code .', { cwd: targetPath }, (err) => {
    if (err) {
      console.error('Error opening VS Code:', err.message);
    } else {
      console.log(`Opened ${targetPath} in VS Code`);
    }
  });
  if (!option.Nc) {
    entry.additional.forEach((additional) => {
      console.log(`Executing command: ${additional}`);
      
      const additionalProcess = spawn(additional, { cwd: targetPath, shell: true });

      additionalProcess.stdout.on('data', (data) => {
        console.log(`[Output]: ${data}`);
      });

      additionalProcess.stderr.on('data', (data) => {
        console.info(`[Info]: ${data}`);
      });

      additionalProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`The command "${additional}" executed successfully.`);
        } else {
          console.error(`The command "${additional}" exited with code: ${code}`);
        }
      });
    });
  }else{
    console.log('Skipped the additional commands')
  }
}

function changeToHomeAndTarget (targetPath: string) : string{

  const homeDir = os.homedir();
  process.chdir(homeDir);

  const absoluteTargetPath = path.isAbsolute(targetPath) ? targetPath : path.resolve(homeDir, targetPath);

  return absoluteTargetPath
}