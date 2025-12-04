import { readJsonFile, writeToJsonFile } from "../utils/write-read-json.js";
import { checkIfExistsInJson, validatePathExists } from "../utils/validations.js";
import { makePrompt } from "../utils/make-prompt.js";
import { spawnPrompt } from "../utils/spawn-prompt.js";

export async function addPath(
  projectPath: string,
  command: string,
): Promise<void> {
  try {
    const absolutePath = validatePathExists(projectPath);

    const data = readJsonFile('path');

    if (checkIfExistsInJson(data, absolutePath, command)) {
      return;
    }

    const additionalParams = await makeAdditional()
    data.push({ path: absolutePath, command, additional: additionalParams });

    writeToJsonFile('path', data);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ ${error.message}`)
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