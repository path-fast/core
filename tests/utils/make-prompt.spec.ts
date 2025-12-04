/**
 * Tests for src/utils/make-prompt.ts
 */

import { makePrompt } from '../../src/utils/make-prompt.js';
import type { EnumTypes } from '../../src/@types/index.js';

describe('make-prompt', () => {
  describe('makePrompt', () => {
    it('should create input prompt correctly', () => {
      const result = makePrompt('input', 'testName', 'Test message');

      expect(result).toEqual({
        type: 'input',
        name: 'testName',
        message: 'Test message'
      });
    });

    it('should create select prompt correctly', () => {
      const result = makePrompt('select', 'testSelect', 'Select an option');

      expect(result).toEqual({
        type: 'select',
        name: 'testSelect',
        message: 'Select an option'
      });
    });

    it('should create confirm prompt correctly', () => {
      const result = makePrompt('confirm', 'testConfirm', 'Are you sure?');

      expect(result).toEqual({
        type: 'confirm',
        name: 'testConfirm',
        message: 'Are you sure?'
      });
    });

    it('should create list prompt correctly', () => {
      const result = makePrompt('list', 'testList', 'Choose from list');

      expect(result).toEqual({
        type: 'list',
        name: 'testList',
        message: 'Choose from list'
      });
    });

    it('should handle empty message', () => {
      const result = makePrompt('input', 'testName', '');

      expect(result).toEqual({
        type: 'input',
        name: 'testName',
        message: ''
      });
    });

    it('should handle empty name', () => {
      const result = makePrompt('input', '', 'Test message');

      expect(result).toEqual({
        type: 'input',
        name: '',
        message: 'Test message'
      });
    });

    it('should handle special characters in name and message', () => {
      const result = makePrompt('input', 'test_name-123', 'Test message with special chars: @#$%');

      expect(result).toEqual({
        type: 'input',
        name: 'test_name-123',
        message: 'Test message with special chars: @#$%'
      });
    });

    it('should handle multiline messages', () => {
      const message = 'Line 1\nLine 2\nLine 3';
      const result = makePrompt('input', 'testName', message);

      expect(result).toEqual({
        type: 'input',
        name: 'testName',
        message: message
      });
    });

    it('should maintain proper type for each enum type', () => {
      const types: EnumTypes[] = ['input', 'select', 'confirm', 'list'];

      types.forEach(type => {
        const result = makePrompt(type, 'testName', 'Test message');
        expect(result.type).toBe(type);
      });
    });

    it('should create prompt object that can be extended', () => {
      const result = makePrompt('input', 'testName', 'Test message');
      
      // Test that we can add additional properties (common in inquirer)
      const extendedPrompt = {
        ...result,
        default: 'default value',
        validate: (input: string) => input.length > 0
      };

      expect(extendedPrompt).toEqual({
        type: 'input',
        name: 'testName',
        message: 'Test message',
        default: 'default value',
        validate: expect.any(Function)
      });
    });

    it('should handle unicode characters in message', () => {
      const result = makePrompt('input', 'testName', '🚀 Unicode message with émojis and açcénts');

      expect(result).toEqual({
        type: 'input',
        name: 'testName',
        message: '🚀 Unicode message with émojis and açcénts'
      });
    });
  });
});