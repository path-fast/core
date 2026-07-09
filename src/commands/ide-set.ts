import { writeToJsonFile } from "#utils/write-read-json.js";

export async function setIde(option:{
  ide : string
}): Promise<void> {

    const ideCommand = option.ide.trim();

    if (!ideCommand) {
      console.error('❌ IDE command cannot be empty.');
      return;
    }

  const data = { command: ideCommand };
  
  writeToJsonFile('ide', data);

}
