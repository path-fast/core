import { readJsonFile, writeToJsonFile } from "../utils/write-read-json.js";
import { checkIfExistsInJson, validatePathExists } from "../utils/validations.js";
import { makePrompt } from "../utils/make-prompt.js";
import { spawnPrompt } from "../utils/spawn-prompt.js";
import { printJson, printJsonError, successEnvelope } from "../utils/output.js";
import type { AddOptions } from "../@types/index.js";

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

    const isNonInteractive = options.ide !== undefined || (options.extra?.length ?? 0) > 0;

    let customIdeCommand: string | null;
    let additionalParams: string[];

    if (isNonInteractive) {
      customIdeCommand = options.ide?.trim() || null;
      additionalParams = options.extra ?? [];
    } else {
      customIdeCommand = await makeCustomIdeCommand();
      additionalParams = await makeAdditional();
    }

    const entry = {
      path: absolutePath,
      command,
      additional: additionalParams,
      ideCommand: customIdeCommand,
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

async function makeAdditional(): Promise<string[]> {
  const promptAnswers = makePrompt('confirm', 'addAdditional', 'Do you want to add an additional parameter?')
  promptAnswers.default = false
  const answers = await spawnPrompt(promptAnswers);

  const additionalParams: string[] = [];

  while (answers.addAdditional) {
    const promptAdditional = makePrompt('input', 'additional', 'Please provide the additional parameter:')
    const additionalAnswer = await spawnPrompt(promptAdditional);

    additionalParams.push(additionalAnswer.additional);

    const promptNextAdditional = makePrompt('confirm', 'addAnother', 'Do you want to add another parameter?')
    promptNextAdditional.default = false
    const continueAddingAnswer = await spawnPrompt(promptNextAdditional);

    answers.addAdditional = continueAddingAnswer.addAnother;
  }

  return additionalParams
}

async function makeCustomIdeCommand(): Promise<string | null> {
  const promptAnswers = makePrompt('confirm', 'customIde', 'Do you want to add a custom IDE command for this path?')
  promptAnswers.default = false
  const customIdeAnswers = await spawnPrompt(promptAnswers);

  if(customIdeAnswers.customIde) {
    const ideCommand = makePrompt('input', 'ideCommand', "Please provide the custom IDE command ex: 'code .'")
    const additionalAnswer = await spawnPrompt(ideCommand);
    const trimmedCommand = additionalAnswer.ideCommand.trim();
    if(trimmedCommand.length > 0) {
      return trimmedCommand
    }
  }

  return null
}
