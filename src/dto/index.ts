import { Answers, UnnamedDistinctQuestion } from "inquirer/dist/commonjs/types";

interface PathEntry {
  path: string;
  command: string;
  additional: string[];
}

interface Opitions {
  Nc?: boolean;
}


type EnumTypes = "select" | "input" | "confirm" | "list" | "confirm"

type PronptType = UnnamedDistinctQuestion<Answers & object> & {name: string;}

export{
  PathEntry,
  EnumTypes,
  PronptType,
  Opitions,
}