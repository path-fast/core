interface PathEntry {
  path: string;
  command: string;
  additional: string[];
}

interface Options {
  code?: boolean;
  extra?: boolean;
}

type EnumTypes = "select" | "input" | "confirm" | "list";

interface PromptType {
  type: EnumTypes;
  name: string;
  message: string;
  [x : string]: string | boolean | string[] | []
}

export { PathEntry, EnumTypes, PromptType, Options };
