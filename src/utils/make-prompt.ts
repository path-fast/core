import { Answers, UnnamedDistinctQuestion } from "inquirer/dist/commonjs/types";
import { EnumTypes } from "../dto";

export function makePrompt (type:EnumTypes, name: string, message: string): UnnamedDistinctQuestion<Answers & object> & { name: string; } {

  const prmpt = {
    type,
    name,
    message,
  }

  return prmpt
}