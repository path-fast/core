import fs from 'fs';
import { importConfig, parseBundleFile } from '../utils/config-bundle.js';
import { printJson, printJsonError, successEnvelope, exitWithCode } from '../utils/output.js';
import { posthog, distinctId, shutdownPosthog } from '../utils/posthog.js';
import type { Options } from '../@types/index.js';

export async function importConfigCommand(file: string, options: Options = {}): Promise<void> {
  if (!fs.existsSync(file)) {
    const message = `File not found: ${file}`;
    if (options.json) {
      printJsonError(message, 'file');
      exitWithCode(1);
    }
    console.error(`❌ ${message}`);
    process.exit(1);
  }

  const content = fs.readFileSync(file, 'utf-8');
  const result = parseBundleFile(content);

  if (!result.valid || !result.bundle) {
    if (options.json) {
      printJson({
        schemaVersion: 1,
        ok: false,
        error: { message: 'Validation failed', errors: result.errors },
      });
      exitWithCode(1);
    }
    console.error('❌ Import validation failed:');
    result.errors.forEach((err) => {
      console.error(`  - ${err.field}: ${err.message}`);
    });
    process.exit(1);
  }

  importConfig(result.bundle);

  posthog.capture({
    distinctId,
    event: 'config_imported',
    properties: { paths_count: result.bundle.paths.length },
  });
  await shutdownPosthog();

  if (options.json) {
    printJson(successEnvelope({
      imported: true,
      pathsCount: result.bundle.paths.length,
    }));
    return;
  }

  console.log(`✅ Config imported from ${file} (${result.bundle.paths.length} path(s))`);
}
