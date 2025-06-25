import { Answers, UnnamedDistinctQuestion } from "inquirer/dist/commonjs/types";

interface PathEntry {
  path: string;
  command: string;
  additional: string[];
}

interface Opitions {
  nc?: boolean;
  Nc?: boolean;
}

type EnumTypes = "select" | "input" | "confirm" | "list"; 

type PronptType = UnnamedDistinctQuestion<Answers & object> & { name: string };

export { PathEntry, EnumTypes, PronptType, Opitions };
