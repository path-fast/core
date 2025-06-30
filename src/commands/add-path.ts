import { cwd } from "process";
import { readJsonFile, writeToJsonFile } from "../utils/write-read-json";
import { checkIfExistsInJson, validatePathExists } from "../utils/validations";
import { makePrompt } from "../utils/make-prompt";
import { spawnPrompt } from "../utils/spown-pronpt";

export async function addPath(
  projectPath: string,
  command: string,
): Promise<void> {

  const absolutePath = projectPath === "." ? validatePathExists(cwd()) : validatePathExists(projectPath);

  const data = readJsonFile();

  if (checkIfExistsInJson(data, absolutePath, command)) {
    return;
  }

  const additionalParams = await makeAdditional()
  data.push({ path: absolutePath, command, additional: additionalParams });

  writeToJsonFile(data);
}

async function makeAdditional (): Promise<string[]>{

  const promptAnswers = makePrompt('confirm', 'addAdditional', 'Do you want to add an additional parameter?')
  promptAnswers.default = false
  const answers = await spawnPrompt(promptAnswers);

  const additionalParams: string[] = [];

  while (answers.addAdditional) {

    const promptAdditional = makePrompt('input','additional','Please provide the additional parameter:')
    const additionalAnswer = await spawnPrompt(promptAdditional);

    additionalParams.push(additionalAnswer.additional);

    const promptNextAdditional = makePrompt('confirm','addAnother','Do you want to add another parameter?')
    promptNextAdditional.default = false
    const continueAddingAnswer = await spawnPrompt(promptNextAdditional);

    answers.addAdditional = continueAddingAnswer.addAnother;
  }

  return additionalParams
}