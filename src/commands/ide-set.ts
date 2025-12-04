import { writeToJsonFile } from "../utils/write-read-json.js";

export function setIde(ide: string): void {

  const ideCommand = ide.trim();

  const data = { command: ideCommand };
  
  writeToJsonFile('ide', data);

}
