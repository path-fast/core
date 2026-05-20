export const OUTPUT_SCHEMA_VERSION = 1;

export interface JsonSuccessEnvelope<T> {
  schemaVersion: number;
  ok: true;
  data: T;
}

export interface JsonErrorEnvelope {
  schemaVersion: number;
  ok: false;
  error: {
    message: string;
    field?: string;
  };
}

export type JsonEnvelope<T> = JsonSuccessEnvelope<T> | JsonErrorEnvelope;

export function printJson(payload: unknown): void {
  console.log(JSON.stringify(payload, null, 2));
}

export function successEnvelope<T>(data: T): JsonSuccessEnvelope<T> {
  return {
    schemaVersion: OUTPUT_SCHEMA_VERSION,
    ok: true,
    data,
  };
}

export function errorEnvelope(message: string, field?: string): JsonErrorEnvelope {
  return {
    schemaVersion: OUTPUT_SCHEMA_VERSION,
    ok: false,
    error: { message, ...(field ? { field } : {}) },
  };
}

export function printJsonError(message: string, field?: string): void {
  console.error(JSON.stringify(errorEnvelope(message, field)));
}

export function exitWithCode(code: number): never {
  process.exit(code);
}
