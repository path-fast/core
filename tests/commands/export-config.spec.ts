import { exportConfigCommand } from '../../src/commands/export-config.js';
import { ConsoleCapture } from '../test-helpers.js';
import fs from 'fs';

jest.mock('../../src/utils/write-read-json.js', () => ({
  readJsonFile: jest.fn(() => []),
}));

jest.mock('../../src/utils/json-path.js', () => ({
  filePath: '/mock/paths.json',
  fileIde: '/mock/ide.json',
}));

describe('exportConfigCommand stdout/file', () => {
  let capture: ConsoleCapture;

  beforeEach(() => {
    capture = new ConsoleCapture();
    capture.start();
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
  });

  afterEach(() => {
    capture.stop();
    jest.restoreAllMocks();
  });

  it('should write to file when --out is provided', () => {
    exportConfigCommand({ out: '/tmp/out.json' });
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(capture.logs.join('\n')).toContain('Config exported');
  });
});
