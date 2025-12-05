/**
 * Tests for src/utils/spawn-prompt.ts
 */

import { spawnPrompt } from '../../src/utils/spawn-prompt.js';
import type { PromptType } from '../../src/@types/index.js';

// Mock inquirer
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

import inquirer from 'inquirer';

const mockPrompt = inquirer.prompt as jest.MockedFunction<typeof inquirer.prompt>;

describe('spawn-prompt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('spawnPrompt', () => {
    it('should call inquirer.prompt with the provided prompt', async () => {
      const prompt: PromptType = {
        type: 'input',
        name: 'testInput',
        message: 'Enter test value'
      };

      const mockResponse = { testInput: 'user response' };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(mockPrompt).toHaveBeenCalledWith([prompt]);
      expect(result).toEqual(mockResponse);
    });

    it('should handle confirm prompts', async () => {
      const prompt: PromptType = {
        type: 'confirm',
        name: 'confirmAction',
        message: 'Are you sure?'
      };

      const mockResponse = { confirmAction: true };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(mockPrompt).toHaveBeenCalledWith([prompt]);
      expect(result).toEqual(mockResponse);
    });

    it('should handle list prompts', async () => {
      const prompt: PromptType = {
        type: 'list',
        name: 'selectOption',
        message: 'Choose an option',
        choices: ['Option 1', 'Option 2', 'Option 3']
      };

      const mockResponse = { selectOption: 'Option 2' };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(mockPrompt).toHaveBeenCalledWith([prompt]);
      expect(result).toEqual(mockResponse);
    });

    it('should handle select prompts', async () => {
      const prompt: PromptType = {
        type: 'select',
        name: 'selectValue',
        message: 'Select a value',
        choices: ['Value A', 'Value B']
      };

      const mockResponse = { selectValue: 'Value A' };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(mockPrompt).toHaveBeenCalledWith([prompt]);
      expect(result).toEqual(mockResponse);
    });

    it('should handle prompts with default values', async () => {
      const prompt: PromptType = {
        type: 'input',
        name: 'inputWithDefault',
        message: 'Enter value',
        default: 'default value'
      };

      const mockResponse = { inputWithDefault: 'default value' };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(mockPrompt).toHaveBeenCalledWith([prompt]);
      expect(result).toEqual(mockResponse);
    });

    it('should handle prompts with validation', async () => {
      const prompt: PromptType = {
        type: 'input',
        name: 'validatedInput',
        message: 'Enter valid value'
      };

      const mockResponse = { validatedInput: 'valid input' };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(mockPrompt).toHaveBeenCalledWith([prompt]);
      expect(result).toEqual(mockResponse);
    });

    it('should handle prompts with when condition', async () => {
      const prompt: PromptType = {
        type: 'input',
        name: 'conditionalInput',
        message: 'This appears conditionally',
        when: true
      };

      const mockResponse = { conditionalInput: 'conditional value' };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(mockPrompt).toHaveBeenCalledWith([prompt]);
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from inquirer', async () => {
      const prompt: PromptType = {
        type: 'input',
        name: 'errorInput',
        message: 'This will error'
      };

      const error = new Error('Inquirer error');
      mockPrompt.mockRejectedValue(error);

      await expect(spawnPrompt(prompt)).rejects.toThrow('Inquirer error');
    });

    it('should handle empty response objects', async () => {
      const prompt: PromptType = {
        type: 'input',
        name: 'emptyResponse',
        message: 'Empty response test'
      };

      mockPrompt.mockResolvedValue({});

      const result = await spawnPrompt(prompt);

      expect(result).toEqual({});
    });

    it('should handle complex prompt objects with multiple properties', async () => {
      const prompt: PromptType = {
        type: 'list',
        name: 'complexPrompt',
        message: 'Complex prompt with many options',
        choices: ['Option 1', 'Option 2', 'Option 3'],
        default: 'Option 2',
        when: true
      };

      const mockResponse = { complexPrompt: 'Option 1' };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(mockPrompt).toHaveBeenCalledWith([prompt]);
      expect(result).toEqual(mockResponse);
    });

    it('should maintain the array structure when calling inquirer', async () => {
      const prompt: PromptType = {
        type: 'input',
        name: 'arrayTest',
        message: 'Testing array structure'
      };

      const mockResponse = { arrayTest: 'response' };
      mockPrompt.mockResolvedValue(mockResponse);

      await spawnPrompt(prompt);

      // Verify that inquirer.prompt was called with an array containing the single prompt
      expect(mockPrompt).toHaveBeenCalledTimes(1);
      expect(mockPrompt).toHaveBeenCalledWith([prompt]);
    });

    it('should handle special characters in responses', async () => {
      const prompt: PromptType = {
        type: 'input',
        name: 'specialChars',
        message: 'Enter special characters'
      };

      const mockResponse = { specialChars: '!@#$%^&*()_+-={}[]|\\:";\'<>?,./' };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(result).toEqual(mockResponse);
    });

    it('should handle unicode characters in responses', async () => {
      const prompt: PromptType = {
        type: 'input',
        name: 'unicode',
        message: 'Enter unicode'
      };

      const mockResponse = { unicode: '🚀 测试 café naïve résumé' };
      mockPrompt.mockResolvedValue(mockResponse);

      const result = await spawnPrompt(prompt);

      expect(result).toEqual(mockResponse);
    });
  });
});