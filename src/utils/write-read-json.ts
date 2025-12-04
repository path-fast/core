import fs from "fs";
import { filePath, fileIde } from "./json-path.js";
import type { ideConfig, PathEntry } from "../@types/index.js";

export function readJsonFile(fileJson: 'ide'): ideConfig 
export function readJsonFile(fileJson: 'path'): PathEntry[] 
export function readJsonFile(fileJson: 'path' | 'ide'): PathEntry[] | ideConfig {
  const file = fileJson === 'path' ? filePath : fileIde;

  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  }
  return [];
}
export function writeToJsonFile(fileJson: 'path', data: PathEntry[]): void;
export function writeToJsonFile(fileJson: 'ide', data: ideConfig): void;
export function writeToJsonFile(fileJson: 'path' | 'ide', data: PathEntry[] | ideConfig): void {
  const file = fileJson === 'path' ? filePath : fileIde;
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}
