import  { type CommandInfo, CommandType } from "../@types/index.js";


export function detectCommandType(command: string): CommandInfo {
  const trimmedCommand = command.trim();
  const firstWord = trimmedCommand.split(' ')[0];

  switch (firstWord) {
    case 'make':
      return makeObjectCommand(trimmedCommand, CommandType.MAKE, true);

    case 'docker':
    case 'docker compose':
      return  makeObjectCommand(trimmedCommand, CommandType.DOCKER, false);

    case 'docker-compose':
      return makeObjectCommand(trimmedCommand, CommandType.DOCKER_COMPOSE, false);

    case 'npm':
      return makeObjectCommand(trimmedCommand, CommandType.NPM, true);

    case 'yarn':
      return makeObjectCommand(trimmedCommand, CommandType.YARN, true);

    case 'pnpm':
      return makeObjectCommand(trimmedCommand, CommandType.PNPM, true); 

    case 'bun':
      return makeObjectCommand(trimmedCommand, CommandType.BUN, true);

    case 'nvm':
      return makeObjectCommand(trimmedCommand, CommandType.NVM, true);

    case 'fnm':
      return makeObjectCommand(trimmedCommand, CommandType.FNM, true);

    default:
      return makeObjectCommand(trimmedCommand, CommandType.GENERIC, true);
  }
}

function makeObjectCommand(command: string, type: CommandType, requiresEnv: boolean): CommandInfo {
  return{
    command,
    type,
    requiresEnv
  }
}

export function getOptimalShell(): string {
  return process.env.SHELL || '/bin/bash';
}

export function buildShellCommand(commandInfoOrArray: CommandInfo | CommandInfo[]): string {
  const shell = getOptimalShell();

  if (!Array.isArray(commandInfoOrArray)) {
    const commandInfo = commandInfoOrArray;
    if (commandInfo.requiresEnv) {
      return `${shell} -lic "${commandInfo.command}"`;
    } else {
      return `${shell} -c "${commandInfo.command}"`;
    }
  }

  // Handle multiple commands - batch execution
  const commands = commandInfoOrArray;
  
  if (commands.length === 0) {
    return '';
  }

  if (commands.length === 1) {
    return buildShellCommand(commands[0]);
  }

  // Check if ANY command requires env loading
  const needsEnv = commands.some(cmd => cmd.requiresEnv);
  
  // Join commands with && to maintain context and stop on first failure
  const joinedCommand = commands
    .map(cmd => cmd.command)
    .join(' && ');
  
  if (needsEnv) {
    return `${shell} -lic "${joinedCommand}"`;
  }
  return `${shell} -c "${joinedCommand}"`;
}