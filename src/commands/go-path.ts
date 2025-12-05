
import { exec, spawn } from 'child_process';
import { readJsonFile } from '../utils/write-read-json.js';
import { detectCommandType, buildShellCommand } from '../utils/command-detector.js';
import type { CommandInfo, Options } from '../@types/index.js';

export function goPath(command: string, option: Options): void {
  const data = readJsonFile('path')
  const entry = data.find(item => item.command === command);

  if (!entry) {
    console.error(`No path found for command "${command}"`);
    return;
  }

  const { path: targetPath, ideCommand } = entry;
  
  console.log(`Navigating to: ${targetPath}`);
  process.chdir(targetPath);

  const { command: ideCommandConfig } = readJsonFile('ide');

  const ideRunner = ideCommand || ideCommandConfig || 'code .';

  if (!option.code) {
  exec(ideRunner, { cwd: targetPath }, (err) => {
      if (err) {
        console.error(`Error opening IDE with command "${ideRunner}":`, err.message);
      } else {
        console.log(`Opened ${targetPath} in IDE using command: ${ideRunner}`);
      }
    });
  } else {
    console.log('Skipped the "code ." command')
  }

  if (!option.extra && entry.additional.length > 0) {
    execAdditionalSequentially(entry.additional, targetPath)
      .then(() => {
        console.log('All additional commands completed.');
      })
      .catch((error) => {
        console.error('Error executing additional commands:', error);
      });
  } else {
    console.log('Skipped the additional commands')
  }
}


async function execAdditionalSequentially(additionals: string[], targetPath: string): Promise<void> {
  const commandInfos = additionals.map(cmd => detectCommandType(cmd));
  
  console.log(`\n🚀 Executing ${commandInfos.length} commands in batch mode:`);
  additionals.forEach((cmd, i) => console.log(`   ${i + 1}. ${cmd}`));
  console.log('');
  await executeBatchCommand(commandInfos, targetPath);
}

function executeBatchCommand(commandInfos: CommandInfo[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const shellCommand = buildShellCommand(commandInfos);
    
    console.log(`📦 Batching commands with shared shell context`,);
    const options = {
      cwd,
      shell: true,
      stdio: 'pipe'
    } as any;

    
    const childProcess = spawn(shellCommand, options);

    if (childProcess.stdout) {
      childProcess.stdout.on('data', (data) => {
        console.log(`📤 [Output]: ${data.toString().trim()}`);
      });
    }

    if (childProcess.stderr) {
      childProcess.stderr.on('data', (data) => {
        console.info(`ℹ️  [Info]: ${data.toString().trim()}`);
      });
    }

    childProcess.on('error', (error) => {
      console.error(`❌ Error spawning batch: ${error.message}`);
      reject(error);
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ All batched commands executed successfully`);
        resolve();
      } else {
        console.error(`❌ Batch execution failed with exit code: ${code}`);
        reject(new Error(`Batch failed with exit code ${code}`));
      }
    });
  });
}