import inquirer from "inquirer";
import { PronptType } from "../dto/index.js";

export async function spawnPrompt(prompt: PronptType): Promise<{[key: string]: any}> {
  return await inquirer.prompt([prompt])
}