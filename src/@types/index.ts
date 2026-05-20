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
  dryRun?: boolean;
  json?: boolean;
}

export interface AddOptions {
  ide?: string;
  extra?: string[];
  json?: boolean;
}

export type GoStepAction = 'chdir' | 'ide' | 'additional';

export interface GoPlanStep {
  action: GoStepAction;
  path?: string;
  command?: string;
  commands?: string[];
  skipped?: boolean;
}

export interface GoPlan {
  command: string;
  targetPath: string;
  ideCommand: string;
  additional: string[];
  steps: GoPlanStep[];
  skipped: {
    ide: boolean;
    additional: boolean;
  };
}

export type DoctorStatus = 'ok' | 'warn' | 'error' | 'info';

export interface DoctorCheck {
  id: string;
  status: DoctorStatus;
  message: string;
}

export interface DoctorSummary {
  ok: number;
  warn: number;
  error: number;
  info: number;
}

export interface PathFastConfigBundle {
  schemaVersion: 1;
  paths: PathEntry[];
  ide: ideConfig;
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

export interface OptionStep {
  shouldRun: () => boolean;
  execute: () => Promise<void>;
  skipMessage: string;
  errorMessage: string;
}