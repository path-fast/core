import { importConfigCommand } from '../../src/commands/import-config.js';
import { ConsoleCapture } from '../test-helpers.js';

jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(),
  copyFileSync: jest.fn(),
}));

jest.mock('../../src/utils/write-read-json.js', () => ({
  writeToJsonFile: jest.fn(),
}));

jest.mock('../../src/utils/json-path.js', () => ({
  filePath: '/mock/paths.json',
  fileIde: '/mock/ide.json',
}));

import { readFileSync } from 'fs';

const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;

describe('importConfigCommand json errors', () => {
  let capture: ConsoleCapture;

  beforeEach(() => {
    capture = new ConsoleCapture();
    capture.start();
  });

  afterEach(() => {
    capture.stop();
  });

  it('should print JSON validation errors', () => {
    mockReadFileSync.mockReturnValue(JSON.stringify({ schemaVersion: 2, paths: [], ide: { command: 'x' } }));
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit');
    }) as never);

    expect(() => importConfigCommand('/tmp/bad.json', { json: true })).toThrow('exit');
    expect(capture.errors.join('\n')).toContain('schemaVersion');
    exitSpy.mockRestore();
  });
});
