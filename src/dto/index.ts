interface PathEntry {
  path: string;
  command: string;
  additional: string[];
}

interface Opitions {
  code?: boolean;
  extra?: boolean;
}

type EnumTypes = "select" | "input" | "confirm" | "list"; 

interface PronptType {
  type: EnumTypes;
  name: string;
  message: string;
  [x : string]: string | boolean | string[] | []
}

export { PathEntry, EnumTypes, PronptType, Opitions };
