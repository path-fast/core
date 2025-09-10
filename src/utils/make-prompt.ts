import type { EnumTypes, PromptType } from "../@types/index.js"

export function makePrompt (type:EnumTypes, name: string, message: string): PromptType  {

  const prompt = {
    type,
    name,
    message,
  }

  return prompt
}