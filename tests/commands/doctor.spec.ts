import { runAllChecks, summarize, doctorCommand } from '../../src/commands/doctor.js';
import { ConsoleCapture } from '../test-helpers.js';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  accessSync: jest.fn(),
}));

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

jest.mock('../../src/utils/write-read-json.js', () => ({
  readJsonFile: jest.fn(),
}));

jest.mock('../../src/utils/json-path.js', () => ({
  filePath: '/mock/.path-fast/paths.json',
  fileIde: '/mock/.path-fast/ide-config.json',
}));

import { existsSync, accessSync, readFileSync } from 'fs';
import { readJsonFile } from '../../src/utils/write-read-json.js';
import { execSync } from 'child_process';

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockAccessSync = accessSync as jest.MockedFunction<typeof accessSync>;
const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;
const mockReadJsonFile = readJsonFile as jest.MockedFunction<typeof readJsonFile>;
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('doctor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockAccessSync.mockImplementation(() => undefined);
    mockReadFileSync.mockReturnValue('[]');
    mockReadJsonFile.mockImplementation(((type: 'path' | 'ide') => {
      if (type === 'ide') return { command: 'code .' };
      return [];
    }) as typeof readJsonFile);
    mockExecSync.mockReturnValue(Buffer.from('/usr/bin/code'));
  });

  it('should return checks with summary', () => {
    const checks = runAllChecks();
    const summary = summarize(checks);
    expect(checks.length).toBeGreaterThan(0);
    expect(summary.ok + summary.warn + summary.error + summary.info).toBe(checks.length);
  });

  it('should print human report', () => {
    const capture = new ConsoleCapture();
    capture.start();
    doctorCommand();
    expect(capture.logs.join('\n')).toContain('Path-Fast Doctor');
    capture.stop();
  });

  it('should report duplicate aliases as error', () => {
    mockReadJsonFile.mockImplementation(((type: 'path' | 'ide') => {
      if (type === 'ide') return { command: 'code .' };
      return [
        { path: '/a', command: 'dup', additional: [], ideCommand: null },
        { path: '/b', command: 'dup', additional: [], ideCommand: null },
      ];
    }) as typeof readJsonFile);

    const checks = runAllChecks();
    expect(checks.some((c) => c.status === 'error' && c.message.includes('Duplicate'))).toBe(true);
  });
});
