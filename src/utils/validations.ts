import  { existsSync }  from "fs";
import { PathEntry } from "../dto";
import { homedir } from "os";
const userHome =  homedir()

export function validatePathExists(projectPath: string) {

  if(!projectPath.startsWith('/')){
    projectPath = `/${projectPath}`
  }

  const startWithHome = RegExp(userHome).exec(projectPath)

  if(startWithHome && existsSync(projectPath)){
    return projectPath
  }
  const projectPathWithHome = `${userHome}${projectPath}`
  if(existsSync(projectPathWithHome)){
    return projectPathWithHome
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
    console.error(
      `Error: The command "${command}" or the path "${absolutePath}" already exists in the registry.`
    );
    return true;
  }
  return false; 
}
