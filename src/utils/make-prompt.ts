import { EnumTypes, PronptType } from "../dto/index.js";

export function makePrompt (type:EnumTypes, name: string, message: string): PronptType  {

  const prompt = {
    type,
    name,
    message,
  }

  return prompt
}