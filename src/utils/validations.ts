import { existsSync } from "fs";
import { homedir } from "os";
import type { PathEntry } from "../@types/index.js";
import { cwd } from "process";


export function validatePathExists(projectPath: string): string {

  if(projectPath === ".") {
    return cwd();
  }

  const resolvedAsIs = projectPath.startsWith("/") ? projectPath : "/" + projectPath;

  const resolvedFromCwd = cwd() + projectPath;
  if (existsSync(resolvedFromCwd)) {
    return resolvedFromCwd;
  }

  const resolvedFromHome = homedir() + resolvedAsIs;
  if (existsSync(resolvedFromHome)) {
    return resolvedFromHome;
  }
  console.log(resolvedFromCwd, resolvedFromHome);
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
