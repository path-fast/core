import { fileURLToPath } from 'url';
import { dirname, resolve } from "path";

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);
export const filePath = resolve(dirName, "../paths.json");
