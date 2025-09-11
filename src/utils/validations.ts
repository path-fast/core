import { existsSync } from "fs";
import { homedir } from "os";
import { resolve, isAbsolute } from "path";
import type { PathEntry } from "../@types/index.js";

const userHome = homedir();

export function validatePathExists(projectPath: string): string {
  // Handle current directory
  if (projectPath === '.') {
    return process.cwd();
  }

  // If it's already an absolute path, check if it exists
  if (isAbsolute(projectPath)) {
    if (existsSync(projectPath)) {
      return projectPath;
    }
    throw new Error(`The path "${projectPath}" does not exist.`);
  }

  // For relative paths, resolve from current directory first
  const resolvedFromCwd = resolve(process.cwd(), projectPath);
  if (existsSync(resolvedFromCwd)) {
    return resolvedFromCwd;
  }

  // If not found from cwd, try resolving from home directory
  const resolvedFromHome = resolve(userHome, projectPath);
  if (existsSync(resolvedFromHome)) {
    return resolvedFromHome;
  }

  throw new Error(`The path "${projectPath}" does not exist.`);
}

export function checkIfExistsInJson(
  data: PathEntry[],
  absolutePath: string,
  command: string
): boolean {
  const existingEntry = data.find(
    (entry) => entry.path === absolutePath || entry.command === command
  );
  if (existingEntry) {
    throw new Error(`Error: The command "${command}" or the path "${absolutePath}" already exists in the registry.`)
  }
  
  return false;
}
