// types/index.d.ts

// Global type declarations for Path-Fast

export interface ideConfig {
  command: string;
}
export interface PathEntry {
  path: string;
  command: string;
  additional: string[];
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
  requiresInteractive: boolean;
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