import { listPaths } from '../../src/commands/list-paths.js';
import { ConsoleCapture } from '../test-helpers.js';
import { samplePathEntries } from '../fixtures/sample-data.js';

jest.mock('../../src/utils/write-read-json.js', () => ({
  readJsonFile: jest.fn(),
}));

import { readJsonFile } from '../../src/utils/write-read-json.js';

const mockReadJsonFile = readJsonFile as jest.MockedFunction<typeof readJsonFile>;

describe('listPaths', () => {
  let capture: ConsoleCapture;

  beforeEach(() => {
    capture = new ConsoleCapture();
    capture.start();
    jest.clearAllMocks();
  });

  afterEach(() => {
    capture.stop();
  });

  it('should print JSON envelope when --json', () => {
    mockReadJsonFile.mockReturnValue(samplePathEntries);

    listPaths({ json: true });

    const parsed = JSON.parse(capture.logs.join('\n'));
    expect(parsed.ok).toBe(true);
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.data.paths).toEqual(samplePathEntries);
  });

  it('should print table in human mode', () => {
    mockReadJsonFile.mockReturnValue(samplePathEntries);

    listPaths();

    expect(capture.logs.join('\n')).toContain('List of paths:');
  });

  it('should print error when empty in human mode', () => {
    mockReadJsonFile.mockReturnValue([]);
    listPaths();
    expect(capture.errors.join('\n')).toContain('No paths found');
  });

  it('should return empty paths in JSON when no entries', () => {
    mockReadJsonFile.mockReturnValue([]);

    listPaths({ json: true });

    const parsed = JSON.parse(capture.logs.join('\n'));
    expect(parsed.data.paths).toEqual([]);
  });
});
