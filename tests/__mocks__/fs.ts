/**
 * Mock for Node.js 'fs' module
 */

export const mockExistsSync = jest.fn();
export const mockReadFileSync = jest.fn();
export const mockWriteFileSync = jest.fn();
export const mockMkdirSync = jest.fn();

const fs = {
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
  mkdirSync: mockMkdirSync,
};

export default fs;