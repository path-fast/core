import {
  OUTPUT_SCHEMA_VERSION,
  successEnvelope,
  errorEnvelope,
} from '../../src/utils/output.js';

describe('output', () => {
  it('should use schema version 1', () => {
    expect(OUTPUT_SCHEMA_VERSION).toBe(1);
  });

  it('should build success envelope', () => {
    const envelope = successEnvelope({ paths: [] });
    expect(envelope).toEqual({
      schemaVersion: 1,
      ok: true,
      data: { paths: [] },
    });
  });

  it('should build error envelope with optional field', () => {
    expect(errorEnvelope('bad', 'paths[0].path')).toEqual({
      schemaVersion: 1,
      ok: false,
      error: { message: 'bad', field: 'paths[0].path' },
    });
  });
});
