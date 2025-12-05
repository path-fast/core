import { makePrompt } from "../utils/make-prompt.js";
import { spawnPrompt } from "../utils/spawn-prompt.js";
import { writeToJsonFile } from "../utils/write-read-json.js";

export async function setIde(): Promise<void> {

    const promptIdeCommand = makePrompt('input', 'ideCommand', "Please provide the custom IDE command ex: 'code .'")
    const prompt = await spawnPrompt(promptIdeCommand);
    const ideCommand = prompt.ideCommand.trim();

    if (!ideCommand) {
      console.error('❌ IDE command cannot be empty.');
      return;
    }

  const data = { command: ideCommand };
  
  writeToJsonFile('ide', data);

}
