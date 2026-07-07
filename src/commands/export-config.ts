import fs from 'fs';
import { exportConfig, formatBundleForStdout, writeBundleToFile } from '../utils/config-bundle.js';
import { printJson, successEnvelope } from '../utils/output.js';
import { posthog, distinctId, shutdownPosthog } from '../utils/posthog.js';
import type { Options } from '../@types/index.js';

export interface ExportOptions extends Options {
  out?: string;
}

export async function exportConfigCommand(options: ExportOptions = {}): Promise<void> {
  const bundle = exportConfig();

  posthog.capture({
    distinctId,
    event: 'config_exported',
    properties: {
      to_file: !!options.out,
      paths_count: bundle.paths.length,
    },
  });
  await shutdownPosthog();

  if (options.json) {
    printJson(successEnvelope({ bundle }));
    return;
  }

  const output = formatBundleForStdout(bundle);

  if (options.out) {
    writeBundleToFile(bundle, options.out);
    console.log(`Config exported to ${options.out}`);
    return;
  }

  console.log(output);
}
