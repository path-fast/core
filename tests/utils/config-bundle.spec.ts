import {
  validateBundle,
  parseBundleFile,
  normalizeIdeConfig,
  importConfig,
} from '../../src/utils/config-bundle.js';

jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  copyFileSync: jest.fn(),
}));

jest.mock('../../src/utils/write-read-json.js', () => ({
  writeToJsonFile: jest.fn(),
}));

import { writeToJsonFile } from '../../src/utils/write-read-json.js';
import { samplePathEntries } from '../fixtures/sample-data.js';

describe('config-bundle', () => {
  it('should validate a correct bundle', () => {
    const result = validateBundle({
      schemaVersion: 1,
      paths: samplePathEntries,
      ide: { command: 'code .' },
    });
    expect(result.valid).toBe(true);
    expect(result.bundle?.paths).toHaveLength(samplePathEntries.length);
  });

  it('should reject invalid schemaVersion', () => {
    const result = validateBundle({
      schemaVersion: 2,
      paths: [],
      ide: { command: 'code .' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'schemaVersion')).toBe(true);
  });

  it('should reject duplicate command aliases', () => {
    const result = validateBundle({
      schemaVersion: 1,
      paths: [
        { path: '/a', command: 'dup', additional: [], ideCommand: null },
        { path: '/b', command: 'dup', additional: [], ideCommand: null },
      ],
      ide: { command: 'code .' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field.includes('command'))).toBe(true);
  });

  it('should report invalid JSON syntax', () => {
    const result = parseBundleFile('{ invalid');
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('root');
  });

  it('should normalize ide config', () => {
    expect(normalizeIdeConfig([])).toEqual({ command: 'code .' });
    expect(normalizeIdeConfig({ command: 'cursor .' })).toEqual({ command: 'cursor .' });
  });

  it('should import valid bundle to disk', () => {
    const bundle = {
      schemaVersion: 1 as const,
      paths: samplePathEntries,
      ide: { command: 'code .' },
    };
    importConfig(bundle);
    expect(writeToJsonFile).toHaveBeenCalledWith('path', samplePathEntries);
    expect(writeToJsonFile).toHaveBeenCalledWith('ide', { command: 'code .' });
  });
});
