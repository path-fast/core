import inquirer from "inquirer";
import { readJsonFile } from "../utils/read-file";
import { writeToJsonFile } from "./creat";

export async function deletePath(command: string): Promise<void> {
  const data = readJsonFile();

  const entryIndex = data.findIndex(entry => entry.command === command);

  if (entryIndex === -1) {
    console.error(`Error: No entry found for the command "${command}".`);
    return;
  }

  // Pergunta de confirmação antes de deletar
  const confirmation = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmDelete',
      message: `Are you sure you want to delete the command "${command}"?`,
      default: false,
    },
  ]);

  if (confirmation.confirmDelete) {
    // Remove o item do array
    data.splice(entryIndex, 1);

    // Escreve novamente no arquivo JSON
    writeToJsonFile(data);
    console.log(`Successfully deleted the command "${command}".`);
  } else {
    console.log('Deletion canceled.');
  }
}
