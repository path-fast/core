/**
 * Mock for 'child_process' module
 */

export const mockExec = jest.fn();
export const mockSpawn = jest.fn();

const childProcess = {
  exec: mockExec,
  spawn: mockSpawn,
};

export default childProcess;