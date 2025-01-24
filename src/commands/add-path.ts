import { readJsonFile, writeToJsonFile } from "../utils/write-read-json";
import { adjustPath, checkIfExistsInJson, validatePathExists } from "../utils/validations";
import inquirer from "inquirer";
import { makePrompt } from "../utils/make-prompt";

export async function addPath(
  projectPath: string,
  command: string,
): Promise<void> {
  const adjustedPath = adjustPath(projectPath);

  const absolutePath = adjustedPath === "." ? process.cwd() : adjustedPath;

  if (!validatePathExists(absolutePath)) {
    return;
  }

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
  const answers = await inquirer.prompt([promptAnswers]);

  const additionalParams: string[] = [];

  while (answers.addAdditional) {

    const promptAdditional = makePrompt('input','additional','Please provide the additional parameter:')
    const additionalAnswer = await inquirer.prompt([promptAdditional]);

    additionalParams.push(additionalAnswer.additional);

    const promptNextAdditional = makePrompt('confirm','addAnother','Do you want to add another parameter?')
    promptNextAdditional.default = false
    const continueAddingAnswer = await inquirer.prompt([promptNextAdditional]);

    answers.addAdditional = continueAddingAnswer.addAnother;
  }

  return additionalParams
}