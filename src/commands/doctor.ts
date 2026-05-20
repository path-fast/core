import fs, { accessSync, constants, existsSync } from 'fs';
import { execSync } from 'child_process';
import { filePath, fileIde } from '../utils/json-path.js';
import { readJsonFile } from '../utils/write-read-json.js';
import { normalizeIdeConfig } from '../utils/config-bundle.js';
import { printJson, successEnvelope, exitWithCode } from '../utils/output.js';
import type { DoctorCheck, DoctorSummary, Options, PathEntry } from '../@types/index.js';

const CONFIG_DIR = filePath.replace(/[/\\][^/\\]+$/, '');

export function doctorCommand(options: Options = {}): void {
  const checks = runAllChecks();
  const summary = summarize(checks);

  if (options.json) {
    printJson(successEnvelope({ checks, summary }));
  } else {
    printHumanReport(checks, summary);
  }

  if (summary.error > 0) {
    exitWithCode(1);
  }
}

export function runAllChecks(): DoctorCheck[] {
  const checks: DoctorCheck[] = [];

  checks.push(checkConfigDir());
  checks.push(...checkConfigFiles());
  checks.push(...checkPaths());
  checks.push(checkGlobalIde());
  checks.push(checkIdeOnPath());

  return checks;
}

function checkConfigDir(): DoctorCheck {
  if (!existsSync(CONFIG_DIR)) {
    return {
      id: 'config-dir',
      status: 'error',
      message: `Config directory does not exist: ${CONFIG_DIR}`,
    };
  }

  try {
    accessSync(CONFIG_DIR, constants.W_OK | constants.R_OK);
    return {
      id: 'config-dir',
      status: 'ok',
      message: `Config directory is readable and writable: ${CONFIG_DIR}`,
    };
  } catch {
    return {
      id: 'config-dir',
      status: 'error',
      message: `Config directory lacks read/write permissions: ${CONFIG_DIR}`,
    };
  }
}

function checkConfigFiles(): DoctorCheck[] {
  const checks: DoctorCheck[] = [];

  for (const { file, label } of [
    { file: filePath, label: 'paths.json' },
    { file: fileIde, label: 'ide-config.json' },
  ]) {
    if (!existsSync(file)) {
      checks.push({
        id: `config-file-${label}`,
        status: 'warn',
        message: `${label} not found (will be created on first use)`,
      });
      continue;
    }

    try {
      const raw = fs.readFileSync(file, 'utf-8');
      JSON.parse(raw);
      checks.push({
        id: `config-file-${label}`,
        status: 'ok',
        message: `${label} is valid JSON`,
      });
    } catch (error) {
      checks.push({
        id: `config-file-${label}`,
        status: 'error',
        message: `${label} contains invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return checks;
}

function checkPaths(): DoctorCheck[] {
  const checks: DoctorCheck[] = [];
  let paths: PathEntry[];

  try {
    paths = readJsonFile('path');
  } catch {
    checks.push({
      id: 'paths-read',
      status: 'error',
      message: 'Failed to read paths.json',
    });
    return checks;
  }

  if (paths.length === 0) {
    checks.push({
      id: 'paths-empty',
      status: 'info',
      message: 'No paths registered yet',
    });
    return checks;
  }

  const commandCounts = new Map<string, number>();
  paths.forEach((entry) => {
    commandCounts.set(entry.command, (commandCounts.get(entry.command) ?? 0) + 1);
  });

  for (const [command, count] of commandCounts) {
    if (count > 1) {
      checks.push({
        id: `duplicate-alias-${command}`,
        status: 'error',
        message: `Duplicate alias "${command}" appears ${count} times`,
      });
    }
  }

  paths.forEach((entry) => {
    if (!existsSync(entry.path)) {
      checks.push({
        id: `missing-path-${entry.command}`,
        status: 'warn',
        message: `Path for "${entry.command}" does not exist: ${entry.path}`,
      });
    }

    if (!entry.ideCommand) {
      checks.push({
        id: `no-per-path-ide-${entry.command}`,
        status: 'info',
        message: `"${entry.command}" uses global IDE fallback`,
      });
    }
  });

  if (checks.filter((c) => c.id.startsWith('duplicate-alias-') || c.id.startsWith('missing-path-')).length === 0) {
    checks.push({
      id: 'paths-valid',
      status: 'ok',
      message: `${paths.length} path(s) loaded without duplicate aliases or missing directories`,
    });
  }

  return checks;
}

function checkGlobalIde(): DoctorCheck {
  try {
    const ide = normalizeIdeConfig(readJsonFile('ide'));
    if (!ide.command.trim()) {
      return {
        id: 'global-ide',
        status: 'warn',
        message: 'Global IDE command is empty; defaulting to "code ."',
      };
    }
    return {
      id: 'global-ide',
      status: 'ok',
      message: `Global IDE command: ${ide.command}`,
    };
  } catch {
    return {
      id: 'global-ide',
      status: 'error',
      message: 'Failed to read ide-config.json',
    };
  }
}

function checkIdeOnPath(): DoctorCheck {
  try {
    const ide = normalizeIdeConfig(readJsonFile('ide'));
    const binary = ide.command.trim().split(/\s+/)[0];
    const whichCmd = process.platform === 'win32' ? 'where' : 'which';

    execSync(`${whichCmd} ${binary}`, { stdio: 'pipe' });
    return {
      id: 'ide-on-path',
      status: 'ok',
      message: `IDE binary "${binary}" found on PATH`,
    };
  } catch {
    const ide = normalizeIdeConfig(readJsonFile('ide'));
    const binary = ide.command.trim().split(/\s+/)[0];
    return {
      id: 'ide-on-path',
      status: 'warn',
      message: `IDE binary "${binary}" not found on PATH`,
    };
  }
}

export function summarize(checks: DoctorCheck[]): DoctorSummary {
  return checks.reduce(
    (acc, check) => {
      acc[check.status === 'warn' ? 'warn' : check.status === 'error' ? 'error' : check.status === 'info' ? 'info' : 'ok']++;
      return acc;
    },
    { ok: 0, warn: 0, error: 0, info: 0 },
  );
}

function printHumanReport(checks: DoctorCheck[], summary: DoctorSummary): void {
  console.log('Path-Fast Doctor\n');
  checks.forEach((check) => {
    const icon =
      check.status === 'ok' ? '✅' :
      check.status === 'warn' ? '⚠️' :
      check.status === 'error' ? '❌' : 'ℹ️';
    console.log(`${icon} [${check.status}] ${check.message}`);
  });
  console.log(`\nSummary: ${summary.ok} ok, ${summary.warn} warn, ${summary.error} error, ${summary.info} info`);
}
