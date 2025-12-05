/**
 * Mock for 'inquirer' module
 */

export const mockPrompt = jest.fn();

const inquirer = {
  prompt: mockPrompt,
};

export default inquirer;