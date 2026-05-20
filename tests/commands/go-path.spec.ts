import { goPath } from '../../src/commands/go-path.js';
import { ConsoleCapture } from '../test-helpers.js';
import type { PathEntry } from '../../src/@types/index.js';

jest.mock('../../src/utils/write-read-json.js', () => ({
  readJsonFile: jest.fn(),
}));

jest.mock('child_process', () => ({
  exec: jest.fn((_cmd: string, _opts: unknown, cb?: (err: null) => void) => {
    cb?.(null);
  }),
  spawn: jest.fn(() => ({
    stdout: { on: jest.fn() },
    stderr: { on: jest.fn() },
    on: jest.fn((event: string, cb: (code: number) => void) => {
      if (event === 'close') {
        cb(0);
      }
    }),
  })),
}));

import { readJsonFile } from '../../src/utils/write-read-json.js';

const mockReadJsonFile = readJsonFile as jest.MockedFunction<typeof readJsonFile>;

const entry: PathEntry = {
  path: '/tmp/project',
  command: 'api',
  additional: ['make up'],
  ideCommand: null,
};

describe('goPath', () => {
  let capture: ConsoleCapture;
  const originalChdir = process.chdir;

  beforeEach(() => {
    capture = new ConsoleCapture();
    capture.start();
    jest.clearAllMocks();
    process.chdir = jest.fn() as typeof process.chdir;
    mockReadJsonFile.mockImplementation(((type: 'path' | 'ide') => {
      if (type === 'ide') return { command: 'code .' };
      return [entry];
    }) as typeof readJsonFile);
  });

  afterEach(() => {
    capture.stop();
    process.chdir = originalChdir;
  });

  it('should not chdir on dry-run', async () => {
    await goPath('api', { dryRun: true });

    expect(process.chdir).not.toHaveBeenCalled();
    expect(capture.logs.join('\n')).toContain('Dry run');
  });

  it('should output JSON plan on dry-run --json', async () => {
    await goPath('api', { dryRun: true, json: true });

    const parsed = JSON.parse(capture.logs.join('\n'));
    expect(parsed.data.plan.command).toBe('api');
    expect(parsed.data.plan.targetPath).toBe('/tmp/project');
  });

  it('should exit with error for unknown alias in dry-run json', async () => {
    mockReadJsonFile.mockReturnValue([]);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit');
    }) as never);

    await expect(goPath('missing', { dryRun: true, json: true })).rejects.toThrow('exit');
    exitSpy.mockRestore();
  });

  it('should chdir when executing normally', async () => {
    await goPath('api', { code: true, extra: true });

    expect(process.chdir).toHaveBeenCalledWith('/tmp/project');
  }, 10000);

  it('should exit when alias is missing in human mode', async () => {
    mockReadJsonFile.mockReturnValue([]);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit');
    }) as never);

    await expect(goPath('missing', {})).rejects.toThrow('exit');
    exitSpy.mockRestore();
  });
});
