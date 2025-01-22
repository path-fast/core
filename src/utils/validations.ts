import  fs  from "fs";

export function validatePathExists(projectPath: string): boolean {
  if (!fs.existsSync(projectPath)) {
    console.error(`Error: The path "${projectPath}" does not exist.`);
    return false;
  }
  return true;
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

export function adjustPath(projectPath: string): string {
  if (projectPath.startsWith("/")) {
    console.warn(
      'Relative paths should not start with "/". Adjusting automatically.'
    );
    projectPath = projectPath.slice(1);
  }
  return projectPath;
}
