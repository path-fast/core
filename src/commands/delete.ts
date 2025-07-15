import { readJsonFile, writeToJsonFile } from "../utils/write-read-json.js";
import { makePrompt } from "../utils/make-prompt.js";
import { spawnPrompt } from "../utils/spown-pronpt.js";

export async function deletePath(command: string): Promise<void> {
  const data = readJsonFile();

  const entryIndex = data.findIndex(entry => entry.command === command);

  if (entryIndex === -1) {
    console.error(`Error: No entry found for the command "${command}".`);
    return;
  }


  const promptConfirmation = makePrompt('confirm', 'confirmDelete', `Are you sure you want to delete the command "${command}"?`)
  promptConfirmation.default = false
  const confirmation = await spawnPrompt(promptConfirmation);

  if (confirmation.confirmDelete) {
    data.splice(entryIndex, 1);

    writeToJsonFile(data);
    console.log(`Successfully deleted the command "${command}".`);
  } else {
    console.log('Deletion canceled.');
  }
}
