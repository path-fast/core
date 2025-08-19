import inquirer from "inquirer";
import { PromptType } from "../dto/index.js";

export async function spawnPrompt(prompt: PromptType): Promise<{[key: string]: any}> {
  return await inquirer.prompt([prompt])
}