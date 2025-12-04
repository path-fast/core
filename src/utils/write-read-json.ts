import fs from "fs";
import { filePath, ideConfig } from "./json-path.js";
import type { PathEntry } from "../@types/index.js";

export function readJsonFile(fileJson: 'path' | 'ide'): PathEntry[] {
  const file = fileJson === 'path' ? filePath : ideConfig;

  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  }
  return [];
}

export function writeToJsonFile(fileJson: 'path' | 'ide', data: PathEntry[]): void {
  const file = fileJson === 'path' ? filePath : ideConfig;
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}
