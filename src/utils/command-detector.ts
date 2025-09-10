import  { type CommandInfo, CommandType } from "../@types/index.js";


export function detectCommandType(command: string): CommandInfo {
  const trimmedCommand = command.trim();
  const firstWord = trimmedCommand.split(' ')[0];

  switch (firstWord) {
    case 'make':
      return {
        command: trimmedCommand,
        type: CommandType.MAKE,
        requiresInteractive: false,
        requiresEnv: true
      };

    case 'docker':
      return {
        command: trimmedCommand,
        type: CommandType.DOCKER,
        requiresInteractive: trimmedCommand.includes(' -it ') || trimmedCommand.includes(' exec '),
        requiresEnv: false
      };

    case 'docker-compose':
    case 'docker compose':
      return {
        command: trimmedCommand,
        type: CommandType.DOCKER_COMPOSE,
        requiresInteractive: trimmedCommand.includes(' -it ') || trimmedCommand.includes(' exec '),
        requiresEnv: false
      };

    case 'npm':
      return {
        command: trimmedCommand,
        type: CommandType.NPM,
        requiresInteractive: isPackageManagerInteractive(trimmedCommand),
        requiresEnv: true
      };

    case 'yarn':
      return {
        command: trimmedCommand,
        type: CommandType.YARN,
        requiresInteractive: isPackageManagerInteractive(trimmedCommand),
        requiresEnv: true
      };

    case 'pnpm':
      return {
        command: trimmedCommand,
        type: CommandType.PNPM,
        requiresInteractive: isPackageManagerInteractive(trimmedCommand),
        requiresEnv: true
      };

    case 'bun':
      return {
        command: trimmedCommand,
        type: CommandType.BUN,
        requiresInteractive: isPackageManagerInteractive(trimmedCommand),
        requiresEnv: true
      };

    case 'nvm':
      return {
        command: trimmedCommand,
        type: CommandType.NVM,
        requiresInteractive: false,
        requiresEnv: true
      };

    case 'fnm':
      return {
        command: trimmedCommand,
        type: CommandType.FNM,
        requiresInteractive: false,
        requiresEnv: true
      };

    default:
      return {
        command: trimmedCommand,
        type: CommandType.GENERIC,
        requiresInteractive: false,
        requiresEnv: true
      };
  }
}

function isPackageManagerInteractive(command: string): boolean {
  const interactiveCommands = ['init', 'create', 'add', 'install'];
  return interactiveCommands.some(cmd => command.includes(` ${cmd}`));
}

export function getOptimalShell(): string {
  // Try to get user's preferred shell from environment
  return process.env.SHELL || '/bin/bash';
}

export function buildShellCommand(commandInfo: CommandInfo): string {
  const shell = getOptimalShell();

  if (commandInfo.requiresEnv) {
    // Use interactive login shell to load full environment
    return `${shell} -lic "${commandInfo.command}"`;
  } else {
    // Use non-interactive shell for simple commands
    return `${shell} -c "${commandInfo.command}"`;
  }
}