import { buildGoPlan } from '../../src/commands/go-plan.js';
import type { PathEntry } from '../../src/@types/index.js';

jest.mock('../../src/utils/write-read-json.js', () => ({
  readJsonFile: jest.fn(),
}));

import { readJsonFile } from '../../src/utils/write-read-json.js';

const mockReadJsonFile = readJsonFile as jest.MockedFunction<typeof readJsonFile>;

const entry: PathEntry = {
  path: '/tmp/project',
  command: 'api',
  additional: ['echo test'],
  ideCommand: 'cursor .',
};

describe('buildGoPlan', () => {
  beforeEach(() => {
    mockReadJsonFile.mockImplementation(((type: 'path' | 'ide') => {
      if (type === 'ide') return { command: 'code .' };
      return [entry];
    }) as typeof readJsonFile);
  });

  it('should resolve per-entry IDE command', () => {
    const plan = buildGoPlan('api', {});
    expect(plan?.ideCommand).toBe('cursor .');
  });

  it('should mark ide step skipped with --code', () => {
    const plan = buildGoPlan('api', { code: true });
    expect(plan?.skipped.ide).toBe(true);
  });

  it('should return null for unknown command', () => {
    mockReadJsonFile.mockReturnValue([]);
    expect(buildGoPlan('missing', {})).toBeNull();
  });
});
