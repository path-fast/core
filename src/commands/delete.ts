import { readJsonFile, writeToJsonFile } from "../utils/write-read-json.js";

export async function deletePath(command: string, option: {
  yes: boolean
}): Promise<void> {
  const data = readJsonFile('path');

  const entryIndex = isNaN(Number(command)) ? data.findIndex(entry => entry.command === command) : Number(command) ;

  if (entryIndex === -1) {
    console.error(`Error: No entry found for the command "${command}".`);
    return;
  }

  if (option.yes) {
    data.splice(entryIndex, 1);
    writeToJsonFile('path', data);
    console.log(`Successfully deleted the command "${command}".`);
  } else {
    console.log('Deletion canceled. Add -y or --yes to confirm.');
  }
}
