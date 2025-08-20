import inquirer from "inquirer";
import type { PromptType } from "../@types/index.js";

export async function spawnPrompt(prompt: PromptType): Promise<{[key: string]: any}> {
  return await inquirer.prompt([prompt])
}