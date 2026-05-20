import { addPath } from '../../src/commands/add-path.js';
import type { PathEntry } from '../../src/@types/index.js';
import { samplePathEntries } from '../fixtures/sample-data.js';
import { ConsoleCapture } from '../test-helpers.js';

jest.mock('../../src/utils/write-read-json.js', () => ({
  readJsonFile: jest.fn(),
  writeToJsonFile: jest.fn(),
}));

jest.mock('../../src/utils/validations.js', () => ({
  validatePathExists: jest.fn((p: string) => `/resolved/${p}`),
  checkIfExistsInJson: jest.fn(() => false),
}));

jest.mock('../../src/utils/spawn-prompt.js', () => ({
  spawnPrompt: jest.fn(),
}));

import { readJsonFile, writeToJsonFile } from '../../src/utils/write-read-json.js';
import { spawnPrompt } from '../../src/utils/spawn-prompt.js';
import { validatePathExists } from '../../src/utils/validations.js';

const mockReadJsonFile = readJsonFile as jest.MockedFunction<typeof readJsonFile>;
const mockWriteToJsonFile = writeToJsonFile as jest.MockedFunction<typeof writeToJsonFile>;
const mockSpawnPrompt = spawnPrompt as jest.MockedFunction<typeof spawnPrompt>;
const mockValidatePathExists = validatePathExists as jest.MockedFunction<typeof validatePathExists>;

describe('addPath', () => {
  let capture: ConsoleCapture;

  beforeEach(() => {
    capture = new ConsoleCapture();
    capture.start();
    jest.clearAllMocks();
    mockReadJsonFile.mockReturnValue([...samplePathEntries]);
    mockValidatePathExists.mockImplementation((p: string) => `/resolved/${p}`);
  });

  afterEach(() => {
    capture.stop();
  });

  it('should add entry without prompts when flags are provided', async () => {
    await addPath('.', 'api', {
      ide: 'cursor .',
      extra: ['make up', 'npm run dev'],
    });

    expect(mockSpawnPrompt).not.toHaveBeenCalled();
    expect(mockValidatePathExists).toHaveBeenCalledWith('.');
    const written = mockWriteToJsonFile.mock.calls[0][1] as unknown as PathEntry[];
    const added = written[written.length - 1];
    expect(added).toEqual({
      command: 'api',
      path: '/resolved/.',
      ideCommand: 'cursor .',
      additional: ['make up', 'npm run dev'],
    });
  });

  it('should use interactive flow when no flags', async () => {
    mockSpawnPrompt
      .mockResolvedValueOnce({ customIde: false })
      .mockResolvedValueOnce({ addAdditional: false });

    await addPath('.', 'cli-app');

    expect(mockSpawnPrompt).toHaveBeenCalled();
    expect(mockWriteToJsonFile).toHaveBeenCalled();
  });

  it('should report JSON error on failure', async () => {
    mockValidatePathExists.mockImplementation(() => {
      throw new Error('bad path');
    });
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit');
    }) as never);

    await expect(addPath('.', 'fail', { json: true })).rejects.toThrow('exit');
    expect(capture.errors.join('\n')).toContain('bad path');
    exitSpy.mockRestore();
  });

  it('should emit JSON on success with --json', async () => {
    await addPath('.', 'json-app', { extra: ['echo hi'], json: true });

    const parsed = JSON.parse(capture.logs.join('\n'));
    expect(parsed.ok).toBe(true);
    expect(parsed.data.entry.command).toBe('json-app');
  });
});
