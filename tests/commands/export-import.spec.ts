import { exportConfigCommand } from '../../src/commands/export-config.js';
import { importConfigCommand } from '../../src/commands/import-config.js';
import { ConsoleCapture } from '../test-helpers.js';
import { samplePathEntries } from '../fixtures/sample-data.js';

jest.mock('../../src/utils/write-read-json.js', () => ({
  readJsonFile: jest.fn(),
  writeToJsonFile: jest.fn(),
}));

jest.mock('../../src/utils/json-path.js', () => ({
  filePath: '/mock/.path-fast/paths.json',
  fileIde: '/mock/.path-fast/ide-config.json',
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  copyFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

import { readJsonFile, writeToJsonFile } from '../../src/utils/write-read-json.js';
import { existsSync, readFileSync } from 'fs';

const mockWriteToJsonFile = writeToJsonFile as jest.MockedFunction<typeof writeToJsonFile>;

const mockReadJsonFile = readJsonFile as jest.MockedFunction<typeof readJsonFile>;
const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;

describe('export/import config', () => {
  let capture: ConsoleCapture;

  beforeEach(() => {
    capture = new ConsoleCapture();
    capture.start();
    jest.clearAllMocks();
    mockReadJsonFile.mockImplementation(((type: 'path' | 'ide') => {
      if (type === 'ide') return { command: 'code .' };
      return samplePathEntries;
    }) as typeof readJsonFile);
  });

  afterEach(() => {
    capture.stop();
  });

  it('should export config as JSON envelope', () => {
    exportConfigCommand({ json: true });
    const parsed = JSON.parse(capture.logs.join('\n'));
    expect(parsed.data.bundle.paths).toEqual(samplePathEntries);
  });

  it('should import valid bundle', () => {
    const bundle = {
      schemaVersion: 1,
      paths: samplePathEntries,
      ide: { command: 'code .' },
    };
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(bundle));

    importConfigCommand('/tmp/backup.json');

    expect(writeToJsonFile).toHaveBeenCalledWith('path', samplePathEntries);
    expect(writeToJsonFile).toHaveBeenCalledWith('ide', { command: 'code .' });
  });

  it('should import valid bundle in human mode', () => {
    const bundle = {
      schemaVersion: 1,
      paths: samplePathEntries,
      ide: { command: 'code .' },
    };
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(bundle));

    importConfigCommand('/tmp/backup.json');

    expect(capture.logs.join('\n')).toContain('imported');
  });

  it('should fail import with field-level errors', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({ schemaVersion: 2, paths: 'bad' }));
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit');
    }) as never);

    expect(() => importConfigCommand('/tmp/bad.json')).toThrow('exit');
    exitSpy.mockRestore();
  });
});
