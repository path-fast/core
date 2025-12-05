/**
 * Test fixtures - Sample data for testing
 */

import type { PathEntry } from '../../src/@types/index.js';

// Sample valid path entries
export const samplePathEntries: PathEntry[] = [
  {
    path: '/home/user/projects/project1',
    command: 'proj1',
    additional: ['npm install', 'npm start'],
    ideCommand: ''
  },
  {
    path: '/home/user/projects/project2',
    command: 'proj2',
    additional: [],
    ideCommand: ''
  },
  {
    path: '/home/user/projects/backend-api',
    command: 'api',
    additional: ['docker-compose up -d', 'npm run dev'],
    ideCommand: ''
  },
];

// Sample invalid path entries for error testing
export const invalidPathEntries = [
  {
    path: '/nonexistent/path',
    command: 'invalid',
    additional: [],
  },
];

// Sample JSON content
export const sampleJsonContent = JSON.stringify(samplePathEntries, null, 2);

// Mock environment variables
export const mockEnvVars = {
  HOME: '/home/testuser',
  NODE_ENV: 'test',
  SHELL: '/bin/bash',
};