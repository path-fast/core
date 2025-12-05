// types/index.d.ts

export interface ideConfig {
  command: string;
}
export interface PathEntry {
  path: string;
  command: string;
  additional: string[];
  ideCommand: string | null;
}

export interface Options {
  code?: boolean;
  extra?: boolean;
}

export type EnumTypes = "select" | "input" | "confirm" | "list";

export interface PromptType {
  type: EnumTypes;
  name: string;
  message: string;
  [x: string]: string | boolean | string[] | [];
}

export interface CommandInfo {
  command: string;
  type: CommandType;
  requiresEnv: boolean;
}

export enum CommandType {
  MAKE = 'make',
  DOCKER = 'docker',
  DOCKER_COMPOSE = 'docker-compose',
  NPM = 'npm',
  YARN = 'yarn',
  PNPM = 'pnpm',
  BUN = 'bun',
  NVM = 'nvm',
  FNM = 'fnm',
  GENERIC = 'generic'
}