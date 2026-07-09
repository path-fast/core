import { readJsonFile, writeToJsonFile } from "../utils/write-read-json.js";
import { checkIfExistsInJson, validatePathExists } from "../utils/validations.js";
import { printJson, printJsonError, successEnvelope } from "../utils/output.js";
import type { AddOptions } from "../types/index.js";

export async function addPath(
  projectPath: string,
  command: string,
  options: AddOptions = {},
): Promise<void> {
  try {
    const absolutePath = validatePathExists(projectPath);
    const data = readJsonFile('path');

    if (checkIfExistsInJson(data, absolutePath, command)) {
      return;
    }

    const additional = options.extra && options.extra?.length >= 1 ? options.extra : []
    const ideCommand = options.ide ?? null 

    const entry = {
      path: absolutePath,
      command,
      additional,
      ideCommand,
    };

    data.push(entry);
    writeToJsonFile('path', data);

    if (options.json) {
      printJson(successEnvelope({ entry }));
    }
  } catch (error) {
    if (error instanceof Error) {
      if (options.json) {
        printJsonError(error.message);
        process.exit(1);
      }
      console.error(`❌ ${error.message}`);
    }
  }
}
