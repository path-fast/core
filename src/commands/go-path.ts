import { exec, spawn } from 'child_process';
import { detectCommandType, buildShellCommand } from '../utils/command-detector.js';
import { printJson, printJsonError, successEnvelope, exitWithCode } from '../utils/output.js';
import { buildGoPlan, printGoPlanHuman } from './go-plan.js';
import type { CommandInfo, GoPlan, Options, OptionStep } from '../@types/index.js';

export async function goPath(command: string, option: Options = {}): Promise<void> {
  const plan = buildGoPlan(command, option);

  if (!plan) {
    if (option.json) {
      printJsonError(`No path found for command "${command}"`, 'command');
      exitWithCode(1);
    }
    console.error(`No path found for command "${command}"`);
    process.exit(1);
  }

  if (option.dryRun) {
    if (option.json) {
      printJson(successEnvelope({ plan }));
      return;
    }
    printGoPlanHuman(plan);
    return;
  }

  console.log(`Navigating to: ${plan.targetPath}`);
  process.chdir(plan.targetPath);

  const optionSteps: OptionStep[] = [
    {
      shouldRun: () => !option.code,
      execute: () => runIdeCommand(plan.ideCommand, plan.targetPath),
      skipMessage: 'Skipped the "code ." command',
      errorMessage: 'Error opening IDE command:',
    },
    {
      shouldRun: () => !option.extra && plan.additional.length > 0,
      execute: () => runAdditionalCommands(plan.additional, plan.targetPath),
      skipMessage: 'Skipped the additional commands',
      errorMessage: 'Error executing additional commands:',
    },
  ];

  await runOptionStepsSequentially(optionSteps);
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
    } as Parameters<typeof spawn>[2];

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
