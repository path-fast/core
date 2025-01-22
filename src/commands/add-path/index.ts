import { writeToJsonFile } from "./creat";
import { readJsonFile } from "../../utils/read-file";
import { adjustPath, checkIfExistsInJson, validatePathExists } from "../../utils/validations";
import { makeAdditional } from "../../utils/make-additinal";

export async function addPath(
  projectPath: string,
  command: string,
): Promise<void> {
  const adjustedPath = adjustPath(projectPath);

  const absolutePath = adjustedPath === "." ? process.cwd() : adjustedPath;

  if (!validatePathExists(absolutePath)) {
    return;
  }

  const data = readJsonFile();

  if (checkIfExistsInJson(data, absolutePath, command)) {
    return;
  }

  const additionalParams = await makeAdditional()
  data.push({ path: absolutePath, command, additional: additionalParams });

  writeToJsonFile(data);
}
