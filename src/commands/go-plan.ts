import { readJsonFile } from '../utils/write-read-json.js';
import type { GoPlan, GoPlanStep, Options, PathEntry } from '../@types/index.js';

const DEFAULT_IDE_COMMAND = 'code .';

export function findPathEntry(command: string): PathEntry | undefined {
  const data = readJsonFile('path');
  return data.find((item) => item.command === command);
}

export function resolveIdeCommand(entry: PathEntry): string {
  const { command: globalIde } = readIdeConfig();
  return entry.ideCommand || globalIde || DEFAULT_IDE_COMMAND;
}

function readIdeConfig(): { command: string } {
  const ide = readJsonFile('ide');
  if (Array.isArray(ide) || !ide || typeof ide !== 'object' || !('command' in ide)) {
    return { command: DEFAULT_IDE_COMMAND };
  }
  const command = (ide as { command?: string }).command;
  return { command: command?.trim() || DEFAULT_IDE_COMMAND };
}

export function buildGoPlan(command: string, options: Options): GoPlan | null {
  const entry = findPathEntry(command);

  if (!entry) {
    return null;
  }

  const { path: targetPath } = entry;
  const resolvedIdeCommand = resolveIdeCommand(entry);
  const skipIde = Boolean(options.code);
  const skipAdditional = Boolean(options.extra) || entry.additional.length === 0;

  const steps: GoPlanStep[] = [
    {
      action: 'chdir',
      path: targetPath,
    },
  ];

  if (!skipIde) {
    steps.push({
      action: 'ide',
      command: resolvedIdeCommand,
      path: targetPath,
    });
  } else {
    steps.push({
      action: 'ide',
      command: resolvedIdeCommand,
      path: targetPath,
      skipped: true,
    });
  }

  if (!skipAdditional && entry.additional.length > 0) {
    steps.push({
      action: 'additional',
      commands: [...entry.additional],
      path: targetPath,
    });
  } else if (entry.additional.length > 0) {
    steps.push({
      action: 'additional',
      commands: [...entry.additional],
      path: targetPath,
      skipped: true,
    });
  }

  return {
    command,
    targetPath,
    ideCommand: resolvedIdeCommand,
    additional: [...entry.additional],
    steps,
    skipped: {
      ide: skipIde,
      additional: skipAdditional,
    },
  };
}

export function printGoPlanHuman(plan: GoPlan): void {
  console.log(`Dry run for "${plan.command}":`);
  console.log(`  1. chdir → ${plan.targetPath}`);
  let stepNum = 2;

  if (!plan.skipped.ide) {
    console.log(`  ${stepNum}. ide → ${plan.ideCommand}`);
    stepNum++;
  } else {
    console.log(`  (skipped) ide → ${plan.ideCommand}`);
  }

  if (plan.additional.length > 0 && !plan.skipped.additional) {
    plan.additional.forEach((cmd, index) => {
      console.log(`  ${stepNum + index}. additional → ${cmd}`);
    });
  } else if (plan.additional.length > 0) {
    plan.additional.forEach((cmd) => {
      console.log(`  (skipped) additional → ${cmd}`);
    });
  }
}
