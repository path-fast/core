/**
 * Tests for src/utils/command-detector.ts
 */

import { 
  detectCommandType, 
  getOptimalShell, 
  buildShellCommand 
} from '../../src/utils/command-detector.js';
import { CommandType } from '../../src/@types/index.js';

describe('command-detector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('detectCommandType', () => {
    describe('Make commands', () => {
      it('should detect make commands', () => {
        const result = detectCommandType('make build');
        
        expect(result).toEqual({
          command: 'make build',
          type: CommandType.MAKE,
          requiresEnv: true
        });
      });

      it('should detect make commands with complex targets', () => {
        const result = detectCommandType('make clean install test');
        
        expect(result).toEqual({
          command: 'make clean install test',
          type: CommandType.MAKE,
          requiresEnv: true
        });
      });
    });

    describe('Docker commands', () => {
      it('should detect regular docker commands', () => {
        const result = detectCommandType('docker build .');
        
        expect(result).toEqual({
          command: 'docker build .',
          type: CommandType.DOCKER,
          requiresEnv: false
        });
      });

      it('should detect docker commands with -it flag', () => {
        const result = detectCommandType('docker run -it ubuntu bash');
        
        expect(result).toEqual({
          command: 'docker run -it ubuntu bash',
          type: CommandType.DOCKER,
          requiresEnv: false
        });
      });

      it('should detect docker exec commands', () => {
        const result = detectCommandType('docker exec -it container_name bash');
        
        expect(result).toEqual({
          command: 'docker exec -it container_name bash',
          type: CommandType.DOCKER,
          requiresEnv: false
        });
      });
    });

    describe('Docker Compose commands', () => {
      it('should detect docker-compose commands', () => {
        const result = detectCommandType('docker-compose up');
        
        expect(result).toEqual({
          command: 'docker-compose up',
          type: CommandType.DOCKER_COMPOSE,
          requiresEnv: false
        });
      });

      it('should detect docker compose commands (new syntax)', () => {
        const result = detectCommandType('docker compose up -d');
        
        expect(result).toEqual({
          command: 'docker compose up -d',
          type: CommandType.DOCKER,
          requiresEnv: false
        });
      });

      it('should detect docker-compose exec commands', () => {
        const result = detectCommandType('docker-compose exec -it web bash');
        
        expect(result).toEqual({
          command: 'docker-compose exec -it web bash',
          type: CommandType.DOCKER_COMPOSE,
          requiresEnv: false
        });
      });
    });

    describe('NPM commands', () => {
      it('should detect npm commands', () => {
        const result = detectCommandType('npm run build');
        
        expect(result).toEqual({
          command: 'npm run build',
          type: CommandType.NPM,
          requiresEnv: true
        });
      });

      it('should detect npm init commands', () => {
        const result = detectCommandType('npm init');
        
        expect(result).toEqual({
          command: 'npm init',
          type: CommandType.NPM,
          requiresEnv: true
        });
      });

      it('should detect npm create commands', () => {
        const result = detectCommandType('npm create react-app my-app');
        
        expect(result).toEqual({
          command: 'npm create react-app my-app',
          type: CommandType.NPM,
          requiresEnv: true
        });
      });

      it('should detect npm install commands', () => {
        const result = detectCommandType('npm install express');
        
        expect(result).toEqual({
          command: 'npm install express',
          type: CommandType.NPM,
          requiresEnv: true
        });
      });
    });

    describe('Yarn commands', () => {
      it('should detect yarn commands', () => {
        const result = detectCommandType('yarn build');
        
        expect(result).toEqual({
          command: 'yarn build',
          type: CommandType.YARN,
          requiresEnv: true
        });
      });

      it('should detect yarn add commands', () => {
        const result = detectCommandType('yarn add react');
        
        expect(result).toEqual({
          command: 'yarn add react',
          type: CommandType.YARN,
          requiresEnv: true
        });
      });
    });

    describe('PNPM commands', () => {
      it('should detect pnpm commands', () => {
        const result = detectCommandType('pnpm run dev');
        
        expect(result).toEqual({
          command: 'pnpm run dev',
          type: CommandType.PNPM,
          requiresEnv: true
        });
      });

      it('should detect pnpm add commands', () => {
        const result = detectCommandType('pnpm add typescript');
        
        expect(result).toEqual({
          command: 'pnpm add typescript',
          type: CommandType.PNPM,
          requiresEnv: true
        });
      });
    });

    describe('Bun commands', () => {
      it('should detect bun commands', () => {
        const result = detectCommandType('bun run test');
        
        expect(result).toEqual({
          command: 'bun run test',
          type: CommandType.BUN,
          requiresEnv: true
        });
      });

      it('should detect bun init commands', () => {
        const result = detectCommandType('bun init');
        
        expect(result).toEqual({
          command: 'bun init',
          type: CommandType.BUN,
          requiresEnv: true
        });
      });
    });

    describe('Node Version Manager commands', () => {
      it('should detect nvm commands', () => {
        const result = detectCommandType('nvm use 18');
        
        expect(result).toEqual({
          command: 'nvm use 18',
          type: CommandType.NVM,
          requiresEnv: true
        });
      });

      it('should detect fnm commands', () => {
        const result = detectCommandType('fnm use 18');
        
        expect(result).toEqual({
          command: 'fnm use 18',
          type: CommandType.FNM,
          requiresEnv: true
        });
      });
    });

    describe('Generic commands', () => {
      it('should detect generic commands', () => {
        const result = detectCommandType('echo "Hello World"');
        
        expect(result).toEqual({
          command: 'echo "Hello World"',
          type: CommandType.GENERIC,
          requiresEnv: true
        });
      });

      it('should handle empty commands', () => {
        const result = detectCommandType('');
        
        expect(result).toEqual({
          command: '',
          type: CommandType.GENERIC,
          requiresEnv: true
        });
      });

      it('should handle commands with only spaces', () => {
        const result = detectCommandType('   ');
        
        expect(result).toEqual({
          command: '',
          type: CommandType.GENERIC,
          requiresEnv: true
        });
      });
    });

    describe('Command trimming', () => {
      it('should trim whitespace from commands', () => {
        const result = detectCommandType('  npm run build  ');
        
        expect(result.command).toBe('npm run build');
        expect(result.type).toBe(CommandType.NPM);
      });
    });
  });

  describe('getOptimalShell', () => {
    const originalShell = process.env.SHELL;

    afterEach(() => {
      process.env.SHELL = originalShell;
    });

    it('should return shell from environment variable', () => {
      process.env.SHELL = '/bin/zsh';
      
      const result = getOptimalShell();
      
      expect(result).toBe('/bin/zsh');
    });

    it('should return default bash when SHELL is not set', () => {
      delete process.env.SHELL;
      
      const result = getOptimalShell();
      
      expect(result).toBe('/bin/bash');
    });

    it('should handle empty SHELL environment variable', () => {
      process.env.SHELL = '';
      
      const result = getOptimalShell();
      
      expect(result).toBe('/bin/bash');
    });
  });

  describe('buildShellCommand', () => {
    const originalShell = process.env.SHELL;

    beforeEach(() => {
      process.env.SHELL = '/bin/bash';
    });

    afterEach(() => {
      process.env.SHELL = originalShell;
    });

    it('should build interactive command for commands requiring environment', () => {
      const commandInfo = {
        command: 'npm run build',
        type: CommandType.NPM,
        requiresEnv: true
      };

      const result = buildShellCommand(commandInfo);
      
      expect(result).toBe('/bin/bash -lic "npm run build"');
    });

    it('should build non-interactive command for commands not requiring environment', () => {
      const commandInfo = {
        command: 'docker ps',
        type: CommandType.DOCKER,
        requiresEnv: false
      };

      const result = buildShellCommand(commandInfo);
      
      expect(result).toBe('/bin/bash -c "docker ps"');
    });

    it('should handle commands with quotes properly', () => {
      const commandInfo = {
        command: 'echo "Hello World"',
        type: CommandType.GENERIC,
        requiresEnv: true
      };

      const result = buildShellCommand(commandInfo);
      
      expect(result).toBe('/bin/bash -lic "echo "Hello World""');
    });

    it('should use custom shell from environment', () => {
      process.env.SHELL = '/bin/zsh';
      
      const commandInfo = {
        command: 'yarn build',
        type: CommandType.YARN,
        requiresEnv: true
      };

      const result = buildShellCommand(commandInfo);
      
      expect(result).toBe('/bin/zsh -lic "yarn build"');
    });
  });
});