import fs from 'fs';
import { exportConfig, formatBundleForStdout, writeBundleToFile } from '../utils/config-bundle.js';
import { printJson, successEnvelope } from '../utils/output.js';
import type { Options } from '../@types/index.js';

export interface ExportOptions extends Options {
  out?: string;
}

export function exportConfigCommand(options: ExportOptions = {}): void {
  const bundle = exportConfig();

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
