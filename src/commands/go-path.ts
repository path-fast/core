import os from 'os'
import path from 'path';
import { exec, spawn } from 'child_process';
import { readJsonFile } from '../utils/write-read-json.js';
import { Opitions } from '../dto/index.js';


export function goPath(command: string, option: Opitions ): void {

  const data = readJsonFile()
  const entry = data.find(item => item.command === command);

  if (!entry) {
    console.error(`No path found for command "${command}"`);
    return;
  }

  const { path: targetPath } = entry;
  process.chdir(changeToHomeAndTarget(targetPath));
  if(!option.code){
    exec('code .', { cwd: targetPath }, (err) => {
      if (err) {
        console.error('Error opening VS Code:', err.message);
      } else {
        console.log(`Opened ${targetPath} in VS Code`);
      }
    });
  }else{
    console.log('Skipped the "code ." command')
  }

  if (!option.extra) {
    execAdditional(entry.additional, targetPath)
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

function execAdditional(additionals : string[], targetPath : string){
  const userShell = process.env.SHELL || '/bin/bash';

  additionals.forEach((additional) => {
    console.log(`Executing command: ${additional}`);

    const command = `${userShell} -ic "${additional}"`;

    const additionalProcess = spawn(command, {
      cwd: targetPath,
      shell: true,
      stdio: 'inherit',
      env: {
        ...process.env,
        NVM_DIR: `${process.env.HOME}/.nvm`, 
      }
    });

    additionalProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`The command "${additional}" executed successfully.`);
      } else {
        console.error(`The command "${additional}" exited with code: ${code}`);
      }
    });
  });
}