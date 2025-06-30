import { EnumTypes, PronptType } from "../dto";

export function makePrompt (type:EnumTypes, name: string, message: string): PronptType  {

  const prompt = {
    type,
    name,
    message,
  }

  return prompt
}