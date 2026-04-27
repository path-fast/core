
import { exec, spawn } from 'child_process';
import { readJsonFile } from '../utils/write-read-json.js';
import { detectCommandType, buildShellCommand } from '../utils/command-detector.js';
import type { CommandInfo, Options, OptionStep } from '../@types/index.js';

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

  const optionSteps: OptionStep[] = [
    {
      shouldRun: () => !option.code,
      execute: () => runIdeCommand(ideRunner, targetPath),
      skipMessage: 'Skipped the "code ." command',
      errorMessage: 'Error opening IDE command:'
    },
    {
      shouldRun: () => !option.extra && entry.additional.length > 0,
      execute: () => runAdditionalCommands(entry.additional, targetPath),
      skipMessage: 'Skipped the additional commands',
      errorMessage: 'Error executing additional commands:'
    }
  ];

  runOptionStepsSequentially(optionSteps);
}

async function runOptionStepsSequentially(steps: OptionStep[]): Promise<void> {
  for (const step of steps) {
    if (!step.shouldRun()) {
      console.log(step.skipMessage);
      continue;
    }

    try {
      await step.execute();
    } catch (error) {
      console.error(step.errorMessage, error);
    }
  }
}

async function runIdeCommand(ideRunner: string, targetPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(ideRunner, { cwd: targetPath }, (err) => {
      if (err) {
        reject(new Error(`Error opening IDE with command "${ideRunner}": ${err.message}`));
        return;
      }

      console.log(`Opened ${targetPath} in IDE using command: ${ideRunner}`);
      resolve();
    });
  });
}

async function runAdditionalCommands(additionals: string[], targetPath: string): Promise<void> {
  const commandInfos = additionals.map(cmd => detectCommandType(cmd));
  
  console.log(`\n🚀 Executing ${commandInfos.length} commands in batch mode:`);
  additionals.forEach((cmd, i) => console.log(`   ${i + 1}. ${cmd}`));
  await executeBatchCommand(commandInfos, targetPath);
  console.log('All additional commands completed.');
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