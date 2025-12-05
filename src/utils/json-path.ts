import { homedir } from 'os';
import { resolve, join } from "path";
import fs from 'fs';
import { writeToJsonFile } from './write-read-json.js';

const homeDir = homedir();
const configDir = join(homeDir, '.path-fast');
export const filePath = resolve(configDir, 'paths.json');
export const fileIde = resolve(configDir, 'ide-config.json');
// Ensure the config directory exists
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });

  writeToJsonFile('ide', { command: 'code .' });
}
