import fs from 'fs';
import { filePath, fileIde } from './json-path.js';
import { readJsonFile, writeToJsonFile } from './write-read-json.js';
import type { ideConfig, PathEntry, PathFastConfigBundle } from '../@types/index.js';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  bundle?: PathFastConfigBundle;
}

export function exportConfig(): PathFastConfigBundle {
  const paths = readJsonFile('path');
  const ide = normalizeIdeConfig(readJsonFile('ide'));

  return {
    schemaVersion: 1,
    paths,
    ide,
  };
}

export function normalizeIdeConfig(raw: unknown): ideConfig {
  if (raw && typeof raw === 'object' && !Array.isArray(raw) && 'command' in raw) {
    const command = String((raw as ideConfig).command ?? '').trim();
    return { command: command || 'code .' };
  }
  return { command: 'code .' };
}

export function parseBundleFile(content: string): ValidationResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Invalid JSON syntax' }],
    };
  }

  return validateBundle(parsed);
}

export function validateBundle(raw: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Config must be a JSON object' }],
    };
  }

  const obj = raw as Record<string, unknown>;

  if (obj.schemaVersion !== 1) {
    errors.push({
      field: 'schemaVersion',
      message: `Unsupported schemaVersion: expected 1, got ${String(obj.schemaVersion)}`,
    });
  }

  if (!Array.isArray(obj.paths)) {
    errors.push({ field: 'paths', message: 'paths must be an array' });
  } else {
    obj.paths.forEach((entry, index) => validatePathEntry(entry, `paths[${index}]`, errors));
    validateDuplicateCommands(obj.paths as PathEntry[], errors);
  }

  if (!obj.ide || typeof obj.ide !== 'object' || Array.isArray(obj.ide)) {
    errors.push({ field: 'ide', message: 'ide must be an object with a command field' });
  } else {
    const ide = obj.ide as Record<string, unknown>;
    if (typeof ide.command !== 'string' || ide.command.trim() === '') {
      errors.push({ field: 'ide.command', message: 'ide.command must be a non-empty string' });
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const bundle: PathFastConfigBundle = {
    schemaVersion: 1,
    paths: obj.paths as PathEntry[],
    ide: normalizeIdeConfig(obj.ide),
  };

  return { valid: true, errors: [], bundle };
}

function validatePathEntry(entry: unknown, prefix: string, errors: ValidationError[]): void {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    errors.push({ field: prefix, message: 'entry must be an object' });
    return;
  }

  const obj = entry as Record<string, unknown>;

  if (typeof obj.path !== 'string' || obj.path.trim() === '') {
    errors.push({ field: `${prefix}.path`, message: 'path must be a non-empty string' });
  }

  if (typeof obj.command !== 'string' || obj.command.trim() === '') {
    errors.push({ field: `${prefix}.command`, message: 'command must be a non-empty string' });
  }

  if (!Array.isArray(obj.additional)) {
    errors.push({ field: `${prefix}.additional`, message: 'additional must be an array' });
  } else {
    obj.additional.forEach((cmd, i) => {
      if (typeof cmd !== 'string') {
        errors.push({ field: `${prefix}.additional[${i}]`, message: 'each additional command must be a string' });
      }
    });
  }

  if (obj.ideCommand !== null && obj.ideCommand !== undefined && typeof obj.ideCommand !== 'string') {
    errors.push({ field: `${prefix}.ideCommand`, message: 'ideCommand must be a string or null' });
  }
}

function validateDuplicateCommands(paths: PathEntry[], errors: ValidationError[]): void {
  const seen = new Map<string, number>();

  paths.forEach((entry, index) => {
    if (!entry?.command) return;
    const cmd = entry.command;
    if (seen.has(cmd)) {
      errors.push({
        field: `paths[${index}].command`,
        message: `Duplicate command alias "${cmd}" (also at paths[${seen.get(cmd)}].command)`,
      });
    } else {
      seen.set(cmd, index);
    }
  });
}

export function importConfig(bundle: PathFastConfigBundle): void {
  backupFile(filePath);
  backupFile(fileIde);

  writeToJsonFile('path', bundle.paths);
  writeToJsonFile('ide', bundle.ide);
}

function backupFile(file: string): void {
  if (!fs.existsSync(file)) return;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${file}.${timestamp}.bak`;
  fs.copyFileSync(file, backupPath);
}

export function writeBundleToFile(bundle: PathFastConfigBundle, outPath: string): void {
  fs.writeFileSync(outPath, JSON.stringify(bundle, null, 2), 'utf-8');
}

export function formatBundleForStdout(bundle: PathFastConfigBundle): string {
  return JSON.stringify(bundle, null, 2);
}
