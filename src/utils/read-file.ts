import fs from "fs";
import { filePath } from "./json-path";


export function readJsonFile(): PathEntry[] {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return [];
}